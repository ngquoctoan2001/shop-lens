import type { Metadata, Viewport } from "next";
import { Quicksand, Nunito } from "next/font/google";
import { site } from "@/site.config";
import "./globals.css";

/**
 * Font tiêu đề. Bắt buộc có subset "vietnamese" — thiếu nó thì các chữ
 * ữ ũ ơ ậ ợ sẽ rơi về font dự phòng và trông lệch hẳn (lỗi của Fredoka).
 * Font tròn dễ thương CÓ tiếng Việt: Quicksand, Baloo_2, Comfortaa, Nunito.
 */
const display = Quicksand({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--ff-display",
  display: "swap",
});

/** Font nội dung */
const body = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--ff-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Đồ len móc tay handmade`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "đồ len handmade",
    "móc khóa len",
    "thú bông amigurumi",
    "túi len móc tay",
    "hoa len",
    "quà tặng handmade",
    site.name,
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: site.name,
    title: `${site.name} — Đồ len móc tay handmade`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Đồ len móc tay handmade`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#fdf8f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
