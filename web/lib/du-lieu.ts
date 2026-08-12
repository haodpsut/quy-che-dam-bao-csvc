/**
 * Gộp hai tầng dữ liệu lại thành thứ giao diện dùng được.
 *
 *   toan-van.generated.json  chữ nguyên văn, sinh từ DOCX, không ai gõ tay
 *   data/chi-tieu.ts         phán đoán chuyên môn, gõ tay, có lý do kèm theo
 *
 * Mọi trang đọc dữ liệu qua đây, không trang nào đọc thẳng file JSON, để chỗ
 * gộp chỉ có một và cổng kiểm số chỉ phải canh một chỗ.
 */
import toanVan from '@/data/toan-van.generated.json'
import { OVERLAY, type ChiTieuOverlay, type KieuCham, type Lop } from '@/data/chi-tieu'
import { NGUONG, type Nguong } from '@/data/nguong'

/* ------------------------------- kiểu dữ liệu ------------------------------ */

export interface Diem {
  ky: string
  text: string
}
export interface Khoan {
  so: number
  text: string
  diem: Diem[]
}
export interface Dieu {
  so: number
  ten: string
  chuong: string
  khoan: Khoan[]
}
export interface Chuong {
  so: string
  stt: number
  ten: string
  dieu: Dieu[]
}
export interface Bang {
  rows: string[][]
}
export interface PhuLuc {
  so: string
  stt: number
  ten: string
  ghiChu: string[]
  doan: string[]
  bang: Bang[]
}

export type NhomChiTieu = 'C' | 'F' | 'I' | 'A' | 'D'

export interface ChiTieu extends ChiTieuOverlay {
  nhom: NhomChiTieu
  ten: string
  congThuc: string
  /** Nguyên văn cột "Nguồn và tần suất", chưa tách. */
  nguonVaTanSuat: string
  nguon: string
  tanSuat: string
  dienGiai: string
}

/* --------------------------------- toàn văn -------------------------------- */

export const QUYET_DINH = toanVan.quyetDinh
export const QUY_DINH = toanVan.quyDinh
export const CHUONG = toanVan.quyDinh.chuong as Chuong[]
export const PHU_LUC = toanVan.phuLuc as PhuLuc[]
export const META = toanVan.meta

export const DIEU: Dieu[] = CHUONG.flatMap((c) => c.dieu)

export function timDieu(so: number): Dieu | undefined {
  return DIEU.find((d) => d.so === so)
}

export function timPhuLuc(so: string): PhuLuc | undefined {
  return PHU_LUC.find((p) => p.so === so)
}

/* -------------------------------- chỉ tiêu -------------------------------- */

const NHOM_TEN: Record<NhomChiTieu, string> = {
  C: 'Cổng tuân thủ',
  F: 'Sức khoẻ tài chính',
  I: 'Dự án đầu tư',
  A: 'Tài sản, cơ sở vật chất',
  D: 'Hạ tầng số, CNTT, dữ liệu',
}

export const NHOM_CHI_TIEU = NHOM_TEN

const LOP_TEN: Record<Lop, string> = {
  taiChinh: 'Sức khoẻ tài chính',
  duAn: 'Dự án đầu tư',
  taiSan: 'Tài sản, cơ sở vật chất',
  haTangSo: 'Hạ tầng số',
}

export const LOP_NHAN = LOP_TEN

/**
 * Cột "Nguồn và tần suất" trong Phụ lục I gộp hai thông tin bằng dấu chấm phẩy,
 * ví dụ "Lịch, nhật ký; học kỳ". Tách ra để lọc được theo tần suất.
 * Nếu không có dấu chấm phẩy thì để nguyên ở nguồn và bỏ trống tần suất, chứ
 * không đoán, vì đoán sai sẽ thành bộ lọc cho kết quả rỗng mà trông như đúng.
 */
function tachNguon(s: string): { nguon: string; tanSuat: string } {
  const i = s.lastIndexOf(';')
  if (i < 0) return { nguon: s.trim(), tanSuat: '' }
  return { nguon: s.slice(0, i).trim(), tanSuat: s.slice(i + 1).trim() }
}

function dungChiTieu(): ChiTieu[] {
  const rows = (PHU_LUC.find((p) => p.so === 'I')?.bang[0]?.rows ?? []).slice(1)
  const theoMa = new Map(OVERLAY.map((o) => [o.ma, o]))
  return rows.map((r) => {
    const [ma, ten, congThuc, nguonVaTanSuat, dienGiai] = r
    const ov = theoMa.get(ma)
    if (!ov) {
      // Không tự bịa mặc định. Thiếu overlay là lỗi dữ liệu, cổng check-chi-tieu bắt.
      throw new Error(`Chỉ tiêu ${ma} có trong Phụ lục I nhưng thiếu overlay trong data/chi-tieu.ts`)
    }
    const { nguon, tanSuat } = tachNguon(nguonVaTanSuat)
    return {
      ...ov,
      nhom: ma[0] as NhomChiTieu,
      ten,
      congThuc,
      nguonVaTanSuat,
      nguon,
      tanSuat,
      dienGiai,
    }
  })
}

export const CHI_TIEU: ChiTieu[] = dungChiTieu()

export function timChiTieu(ma: string): ChiTieu | undefined {
  return CHI_TIEU.find((c) => c.ma.toLowerCase() === ma.toLowerCase())
}

export function chiTieuTheoNhom(nhom: NhomChiTieu): ChiTieu[] {
  return CHI_TIEU.filter((c) => c.nhom === nhom)
}

export function chiTieuTheoDieu(soDieu: number): ChiTieu[] {
  return CHI_TIEU.filter((c) => c.dieuLienQuan.includes(soDieu))
}

/* --------------------------------- ngưỡng --------------------------------- */

export { NGUONG }
export type { Nguong }

export function timNguong(id: string): Nguong | undefined {
  return NGUONG.find((n) => n.id === id)
}

export function nguongCuaChiTieu(ma: string): Nguong[] {
  return NGUONG.filter((n) => n.chiTieu.includes(ma))
}

/** Tần suất chuẩn hoá để làm bộ lọc. Lấy từ chữ thật trong văn bản, không tự đặt. */
export const TAN_SUAT_LOC = [
  { khoa: 'thang', nhan: 'Tháng', khop: (s: string) => /tháng/i.test(s) },
  { khoa: 'quy', nhan: 'Quý', khop: (s: string) => /quý/i.test(s) },
  { khoa: 'hocky', nhan: 'Học kỳ', khop: (s: string) => /học kỳ/i.test(s) },
  { khoa: 'nam', nhan: 'Năm', khop: (s: string) => /năm|hằng năm/i.test(s) },
  { khoa: 'moc', nhan: 'Mốc 6/12/24 tháng', khop: (s: string) => /6\/12\/24/.test(s) },
  { khoa: 'ketthuc', nhan: 'Khi kết thúc', khop: (s: string) => /kết thúc/i.test(s) },
] as const

export type { KieuCham, Lop, ChiTieuOverlay }
