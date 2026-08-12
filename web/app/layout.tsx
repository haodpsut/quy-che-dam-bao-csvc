import type { Metadata } from 'next'
import { Noto_Sans } from 'next/font/google'
import './globals.css'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'

/* Noto Sans là mặt chữ của template slide DAU, nạp qua fontspec trong
   slide-template-giang-day.tex. Dùng lại để web, slide và bản in cùng một mặt chữ. */
const noto = Noto_Sans({
  variable: '--font-noto',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Đánh giá hiệu quả đầu tư và sử dụng tài sản — Trường Đại học Kiến trúc Đà Nẵng',
    template: '%s — Đánh giá hiệu quả đầu tư và sử dụng tài sản DAU',
  },
  description:
    'Tra cứu và vận hành Quy định về tiêu chí và quy trình đánh giá hiệu quả dự án đầu tư và hiệu quả khai thác, sử dụng tài sản, cơ sở vật chất, trang thiết bị và hạ tầng số của Trường Đại học Kiến trúc Đà Nẵng.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="vi" className={`${noto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1 w-full">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
