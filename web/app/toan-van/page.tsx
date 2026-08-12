import type { Metadata } from 'next'
import Link from 'next/link'
import { CHUONG, PHU_LUC, QUY_DINH, chiTieuTheoDieu, NGUONG } from '@/lib/du-lieu'
import { NhanTrangThai } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Toàn văn Quy định',
  description: 'Toàn văn 7 chương, 35 điều và 4 phụ lục, có mục lục và neo tới từng điều.',
}

export default function TrangToanVan() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-7">
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
        {/* -------------------------------- mục lục ------------------------------- */}
        <nav className="muc-luc-dinh khong-in mb-6 lg:mb-0" aria-label="Mục lục">
          <p className="mb-2 text-[12px] font-bold uppercase tracking-wide text-muted">Mục lục</p>
          <ol className="space-y-2 text-[13px]">
            {CHUONG.map((c) => (
              <li key={c.so}>
                <a href={`#chuong-${c.so}`} className="font-semibold text-brand hover:underline">
                  Chương {c.so}. {c.ten}
                </a>
                <ol className="mt-1 space-y-0.5 border-l border-line pl-2.5">
                  {c.dieu.map((d) => (
                    <li key={d.so}>
                      <a href={`#dieu-${d.so}`} className="text-ink/75 hover:text-brand hover:underline">
                        Điều {d.so}. {d.ten}
                      </a>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
            {PHU_LUC.map((p) => (
              <li key={p.so}>
                <a href={`#phu-luc-${p.so}`} className="font-semibold text-brand hover:underline">
                  Phụ lục {p.so}. {p.ten}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* --------------------------------- thân --------------------------------- */}
        <article>
          <header className="mb-7 border-b-2 border-gold pb-4 text-center">
            <h1 className="text-2xl font-bold text-brand">QUY ĐỊNH</h1>
            {QUY_DINH.tieuDe.map((t, i) => (
              <p key={i} className="text-[15.5px] font-medium">
                {t}
              </p>
            ))}
            <p className="mt-2 text-[13px] italic text-muted">{QUY_DINH.banHanhKem}</p>
          </header>

          {CHUONG.map((c) => (
            <section key={c.so} id={`chuong-${c.so}`} className="mb-8 scroll-mt-24">
              <h2 className="mb-4 text-center">
                <span className="block text-[15px] font-semibold">Chương {c.so}</span>
                <span className="block text-lg font-bold uppercase text-brand">{c.ten}</span>
              </h2>

              {c.dieu.map((d) => {
                const ct = chiTieuTheoDieu(d.so)
                const ng = NGUONG.filter((n) => n.dieu === d.so)
                return (
                  <section key={d.so} id={`dieu-${d.so}`} className="mb-6 scroll-mt-24">
                    <h3 className="text-[16px] font-bold">
                      Điều {d.so}. {d.ten}
                    </h3>

                    <div className="mt-1.5 space-y-2 text-[15px] leading-relaxed">
                      {d.khoan.map((k) => (
                        <div key={k.so}>
                          <p className="text-justify">{k.text}</p>
                          {k.diem.length > 0 && (
                            <div className="mt-1 space-y-1 pl-5">
                              {k.diem.map((p) => (
                                <p key={p.ky} className="text-justify">
                                  {p.text}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Nối điều với thước đo và với con số. Đây là thứ bản Word không làm được. */}
                    {(ct.length > 0 || ng.length > 0) && (
                      <div className="khong-in mt-2.5 rounded-md border border-line bg-surface px-3 py-2 text-[12.5px]">
                        {ct.length > 0 && (
                          <p>
                            <span className="font-semibold">Chỉ tiêu đo điều này: </span>
                            {ct.map((x, i) => (
                              <span key={x.ma}>
                                {i > 0 && ', '}
                                <Link
                                  href={`/chi-tieu/${x.ma.toLowerCase()}`}
                                  className="text-brand underline underline-offset-2"
                                  title={x.ten}
                                >
                                  {x.ma}
                                </Link>
                              </span>
                            ))}
                          </p>
                        )}
                        {ng.length > 0 && (
                          <p className={ct.length > 0 ? 'mt-1' : ''}>
                            <span className="font-semibold">Ngưỡng nhắc trong điều này: </span>
                            {ng.map((n, i) => (
                              <span key={n.id} className="mr-1.5 inline-flex items-center gap-1">
                                {i > 0 && ' '}
                                <Link href="/nguong" className="text-brand underline underline-offset-2">
                                  {n.giaTri}
                                </Link>
                                <NhanTrangThai trangThai={n.trangThai} />
                              </span>
                            ))}
                          </p>
                        )}
                      </div>
                    )}
                  </section>
                )
              })}
            </section>
          ))}

          {/* -------------------------------- phụ lục ------------------------------- */}
          {PHU_LUC.map((p) => (
            <section key={p.so} id={`phu-luc-${p.so}`} className="ngat-trang mb-8 scroll-mt-24">
              <header className="mb-3 text-center">
                <h2 className="text-lg font-bold text-brand">PHỤ LỤC {p.so}</h2>
                <p className="text-[15.5px] font-semibold uppercase">{p.ten}</p>
                {p.ghiChu.map((g, i) => (
                  <p key={i} className="mt-1 text-[12.5px] italic text-muted">
                    {g}
                  </p>
                ))}
              </header>

              {p.doan.map((t, i) => (
                <p key={i} className="mb-2 text-justify text-[15px]">
                  {t}
                </p>
              ))}

              {p.bang.map((b, i) => (
                <div key={i} className="bang-cuon my-4">
                  <table className="bang">
                    <thead>
                      <tr>
                        {b.rows[0].map((o, j) => (
                          <th key={j}>{o}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.slice(1).map((r, j) => (
                        <tr key={j}>
                          {r.map((o, k) => (
                            <td key={k} className={k === 0 ? 'whitespace-nowrap font-semibold' : ''}>
                              {p.so === 'I' && k === 0 ? (
                                <Link
                                  href={`/chi-tieu/${o.toLowerCase()}`}
                                  className="text-brand underline underline-offset-2"
                                >
                                  {o}
                                </Link>
                              ) : (
                                o
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </section>
          ))}
        </article>
      </div>
    </div>
  )
}
