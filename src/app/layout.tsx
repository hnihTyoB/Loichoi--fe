import type { Metadata } from "next";
import { Quicksand, Nunito } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
});

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: "%s | Loichoi",
    default: "Loichoi | Theme bàn phím điện thoại cho iOS và Android",
  },
  description: "Xem trước nhiều hình ảnh và tải bộ file theme bàn phím điện thoại cho iOS, Android.",
  icons: {
    icon: "/images/logos/logo_loichoi.png",
    apple: "/images/logos/logo_loichoi.png",
  },
  openGraph: {
    siteName: "Loichoi",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`${quicksand.variable} ${nunito.variable}`}>
      <body className={quicksand.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
