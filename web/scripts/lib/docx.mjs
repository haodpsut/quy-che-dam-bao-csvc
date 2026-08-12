/**
 * Đọc DOCX bằng Node thuần, không phụ thuộc gói ngoài.
 *
 * Lý do tự viết: bộ bóc tách này là đối chứng của cổng kiểm số. Nếu nó phụ thuộc
 * một gói npm thì bản thân phép kiểm lại phụ thuộc thứ mình không kiểm được.
 * DOCX là ZIP, các mục bên trong nén deflate, mà node:zlib có sẵn inflateRawSync.
 */
import { readFileSync } from 'node:fs'
import { inflateRawSync } from 'node:zlib'

const SIG_EOCD = 0x06054b50
const SIG_CEN = 0x02014b50
const SIG_LOC = 0x04034b50

/** Đọc một mục trong file ZIP, trả về Buffer đã giải nén. */
export function readZipEntry(zipPath, entryName) {
  const buf = readFileSync(zipPath)

  // Tìm End Of Central Directory, quét ngược từ cuối vì comment cuối file có độ dài thay đổi.
  let eocd = -1
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === SIG_EOCD) {
      eocd = i
      break
    }
  }
  if (eocd < 0) throw new Error(`Không tìm thấy EOCD trong ${zipPath}, file không phải ZIP hợp lệ`)

  const entryCount = buf.readUInt16LE(eocd + 10)
  let pos = buf.readUInt32LE(eocd + 16)

  for (let n = 0; n < entryCount; n++) {
    if (buf.readUInt32LE(pos) !== SIG_CEN) {
      throw new Error(`Sai chữ ký central directory ở mục thứ ${n}`)
    }
    const method = buf.readUInt16LE(pos + 10)
    const compSize = buf.readUInt32LE(pos + 20)
    const nameLen = buf.readUInt16LE(pos + 28)
    const extraLen = buf.readUInt16LE(pos + 30)
    const commentLen = buf.readUInt16LE(pos + 32)
    const localOfs = buf.readUInt32LE(pos + 42)
    const name = buf.toString('utf8', pos + 46, pos + 46 + nameLen)

    if (name === entryName) {
      if (buf.readUInt32LE(localOfs) !== SIG_LOC) {
        throw new Error(`Sai chữ ký local header của ${entryName}`)
      }
      // Local header có độ dài name/extra riêng, không dùng lại của central directory được.
      const locNameLen = buf.readUInt16LE(localOfs + 26)
      const locExtraLen = buf.readUInt16LE(localOfs + 28)
      const dataStart = localOfs + 30 + locNameLen + locExtraLen
      const raw = buf.subarray(dataStart, dataStart + compSize)
      if (method === 0) return Buffer.from(raw)
      if (method === 8) return inflateRawSync(raw)
      throw new Error(`Mục ${entryName} dùng phương pháp nén ${method}, chưa hỗ trợ`)
    }
    pos += 46 + nameLen + extraLen + commentLen
  }
  throw new Error(`Không tìm thấy mục ${entryName} trong ${zipPath}`)
}

/* ---------------------------------------------------------------------------
   Bóc văn bản từ word/document.xml.

   Không dùng trình phân tích XML đầy đủ vì chỉ cần ba việc: lấy chữ trong <w:t>,
   biết ranh giới <w:p>, biết ranh giới bảng <w:tbl>/<w:tr>/<w:tc>. Dùng regex có
   kiểm soát trên chuỗi đã tách thẻ là đủ và không kéo thêm phụ thuộc.
   --------------------------------------------------------------------------- */

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }

function unescapeXml(s) {
  return s.replace(/&(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);/g, (m, g) => {
    if (g[0] === '#') {
      const code = g[1] === 'x' ? parseInt(g.slice(2), 16) : parseInt(g.slice(1), 10)
      return String.fromCodePoint(code)
    }
    return ENTITIES[g] ?? m
  })
}

/** Gom chữ của mọi <w:t> trong một đoạn XML. */
function textOf(xml) {
  let out = ''
  const re = /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>|<w:tab\/>|<w:br\/>/g
  let m
  while ((m = re.exec(xml)) !== null) {
    if (m[1] !== undefined) out += unescapeXml(m[1])
    else out += ' '
  }
  return out
}

/**
 * Trả về danh sách khối theo đúng thứ tự trong tài liệu.
 * Khối đoạn: { kind: 'p', text }
 * Khối bảng: { kind: 'table', rows: string[][] }
 */
export function readDocxBlocks(docxPath) {
  const xml = readZipEntry(docxPath, 'word/document.xml').toString('utf8')
  const bodyStart = xml.indexOf('<w:body>')
  const bodyEnd = xml.lastIndexOf('</w:body>')
  const body = xml.slice(bodyStart + 8, bodyEnd)

  const blocks = []
  let i = 0
  while (i < body.length) {
    const nextP = body.indexOf('<w:p ', i)
    const nextP2 = body.indexOf('<w:p>', i)
    const nextTbl = body.indexOf('<w:tbl>', i)
    const pAt = [nextP, nextP2].filter((x) => x >= 0).sort((a, b) => a - b)[0] ?? -1

    if (nextTbl >= 0 && (pAt < 0 || nextTbl < pAt)) {
      const end = findClose(body, nextTbl, '<w:tbl>', '</w:tbl>')
      const tblXml = body.slice(nextTbl, end)
      blocks.push({ kind: 'table', rows: parseTable(tblXml) })
      i = end
      continue
    }
    if (pAt >= 0) {
      const end = findCloseP(body, pAt)
      const pXml = body.slice(pAt, end)
      const text = normalizeSpace(textOf(pXml))
      if (text) blocks.push({ kind: 'p', text })
      i = end
      continue
    }
    break
  }
  return blocks
}

/** Tìm thẻ đóng có tính lồng nhau (bảng lồng bảng). */
function findClose(s, start, openTag, closeTag) {
  let depth = 0
  let i = start
  while (i < s.length) {
    const o = s.indexOf(openTag, i)
    const c = s.indexOf(closeTag, i)
    if (c < 0) return s.length
    if (o >= 0 && o < c) {
      depth++
      i = o + openTag.length
    } else {
      depth--
      i = c + closeTag.length
      if (depth === 0) return i
    }
  }
  return s.length
}

/** Đoạn không lồng nhau nên chỉ cần thẻ đóng đầu tiên. */
function findCloseP(s, start) {
  const c = s.indexOf('</w:p>', start)
  return c < 0 ? s.length : c + 6
}

function parseTable(tblXml) {
  const rows = []
  // Bỏ phần <w:tblPr> để tránh bắt nhầm ô của bảng lồng trong thuộc tính.
  const trRe = /<w:tr\b[\s\S]*?<\/w:tr>/g
  let m
  while ((m = trRe.exec(tblXml)) !== null) {
    const trXml = m[0]
    const cells = []
    const tcRe = /<w:tc\b[\s\S]*?<\/w:tc>/g
    let c
    while ((c = tcRe.exec(trXml)) !== null) {
      // Trong một ô, mỗi <w:p> là một dòng; nối bằng khoảng trắng để giữ nguyên chữ.
      const paras = []
      const pRe = /<w:p\b[\s\S]*?<\/w:p>/g
      let p
      while ((p = pRe.exec(c[0])) !== null) {
        const t = normalizeSpace(textOf(p[0]))
        if (t) paras.push(t)
      }
      cells.push(paras.join(' '))
    }
    if (cells.length) rows.push(cells)
  }
  return rows
}

/** Chuẩn hoá khoảng trắng: gộp mọi loại space, bỏ đầu cuối. Không đụng tới chữ. */
export function normalizeSpace(s) {
  return s
    .replace(/ /g, ' ')
    .replace(/[\t\r\n]+/g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim()
}
