import Link from 'next/link'
import type { ReactNode } from 'react'
import { TRANG_THAI_NHAN, type TrangThaiNguong } from '@/data/nguong'

/** Khung trang chung: tiêu đề, dẫn nhập, thân. */
export function Trang({
  tieuDe,
  phu,
  canCu,
  children,
  rong,
}: {
  tieuDe: string
  phu?: ReactNode
  /** Điều khoản gốc, hiện ngay dưới tiêu đề để người đọc biết trang này dựa vào đâu. */
  canCu?: string
  children: ReactNode
  rong?: boolean
}) {
  return (
    <div className={`mx-auto px-4 py-7 ${rong ? 'max-w-7xl' : 'max-w-4xl'}`}>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-brand sm:text-[28px]">{tieuDe}</h1>
        {canCu && <p className="mt-1 text-[13px] font-medium text-muted">{canCu}</p>}
        {phu && <div className="mt-3 text-[15px] text-ink/90">{phu}</div>}
      </header>
      {children}
    </div>
  )
}

export function Muc({ id, ten, children }: { id?: string; ten: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-8 scroll-mt-24">
      <h2 className="tieu-de-chuong mb-3 pb-1 text-lg font-bold">{ten}</h2>
      {children}
    </section>
  )
}

type LoaiKhoi = 'nhan' | 'canhBao' | 'cam' | 'dat'

const LOP_KHOI: Record<LoaiKhoi, string> = {
  nhan: 'khoi-nhan',
  canhBao: 'khoi-canh-bao',
  cam: 'khoi-cam',
  dat: 'khoi-dat',
}

export function Khoi({
  loai = 'nhan',
  tieuDe,
  children,
}: {
  loai?: LoaiKhoi
  tieuDe?: string
  children: ReactNode
}) {
  return (
    <div className={`${LOP_KHOI[loai]} my-4 rounded-r-md px-4 py-3 text-[14px]`}>
      {tieuDe && <p className="mb-1 font-semibold">{tieuDe}</p>}
      <div className="space-y-2">{children}</div>
    </div>
  )
}

const LOP_NHAN: Record<TrangThaiNguong, string> = {
  phapLy: 'nhan-phaply',
  quyChe: 'nhan-quyche',
  mucTieuChuaDuyet: 'nhan-chuaduyet',
  mucTieuDaDuyet: 'nhan-daduyet',
}

export function NhanTrangThai({ trangThai }: { trangThai: TrangThaiNguong }) {
  return (
    <span className={`nhan ${LOP_NHAN[trangThai]}`} title={TRANG_THAI_NHAN[trangThai].moTa}>
      {TRANG_THAI_NHAN[trangThai].nhan}
    </span>
  )
}

export function Nhan({ children, loai = 'trung' }: { children: ReactNode; loai?: 'trung' | 'nhom' }) {
  return <span className={`nhan nhan-${loai}`}>{children}</span>
}

/** Liên kết tới một điều trong toàn văn. Một chỗ duy nhất sinh neo, để cổng kiểm liên kết canh được. */
export function LinkDieu({ so, khoan, ten }: { so: number; khoan?: number; ten?: string }) {
  return (
    <Link href={`/toan-van#dieu-${so}`} className="text-brand underline decoration-gold/70 underline-offset-2 hover:decoration-brand">
      Điều {so}
      {khoan ? ` khoản ${khoan}` : ''}
      {ten ? `. ${ten}` : ''}
    </Link>
  )
}

/**
 * Nguồn của một ngưỡng, trỏ đúng chỗ con số thật sự nằm.
 *
 * Con số của nhiều ngưỡng nằm ở phụ lục chứ không nằm trong thân điều. Chỉ ghi
 * "Điều 29 khoản 2" cho cỡ mẫu 50% là gửi người đọc tới một điều không hề chứa
 * con số đó. Khi có phụ lục thì phụ lục đứng trước, điều đứng sau như bối cảnh.
 */
export function NguonNguong({
  dieu,
  khoan,
  phuLuc,
}: {
  dieu: number
  khoan?: number
  phuLuc?: 'I' | 'II' | 'III' | 'IV'
}) {
  if (!phuLuc) return <LinkDieu so={dieu} khoan={khoan} />
  return (
    <>
      <Link
        href={`/toan-van#phu-luc-${phuLuc}`}
        className="text-brand underline decoration-gold/70 underline-offset-2 hover:decoration-brand"
      >
        Phụ lục {phuLuc}
      </Link>
      <span className="text-muted">
        {' '}
        (liên quan <LinkDieu so={dieu} khoan={khoan} />)
      </span>
    </>
  )
}

export function LinkChiTieu({ ma, ten }: { ma: string; ten?: string }) {
  return (
    <Link
      href={`/chi-tieu/${ma.toLowerCase()}`}
      className="font-medium text-brand underline decoration-gold/70 underline-offset-2 hover:decoration-brand"
    >
      {ma}
      {ten ? ` — ${ten}` : ''}
    </Link>
  )
}

/** Trích nguyên văn một đoạn của Quy định. Luôn kèm nguồn để phân biệt với lời của trang. */
export function TrichDan({ children, nguon }: { children: ReactNode; nguon: string }) {
  return (
    <figure className="my-3 border-l-4 border-line-dam bg-surface px-4 py-2.5">
      <blockquote className="text-[14px] italic text-ink/85">{children}</blockquote>
      <figcaption className="mt-1 text-[12px] font-medium text-muted">{nguon}</figcaption>
    </figure>
  )
}

export function BangCuon({ children }: { children: ReactNode }) {
  return (
    <div className="bang-cuon my-4">
      <table className="bang">{children}</table>
    </div>
  )
}

/** Thẻ dẫn sang một trang khác. */
export function The({ href, tieuDe, children }: { href: string; tieuDe: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="khoi block px-4 py-3 transition hover:border-brand hover:shadow-sm"
    >
      <p className="font-semibold text-brand">{tieuDe}</p>
      <p className="mt-1 text-[13.5px] text-muted">{children}</p>
    </Link>
  )
}
