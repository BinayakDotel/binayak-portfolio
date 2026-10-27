import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { content } from "@/lib/content";
import { MODE_SCRIPT } from "@/lib/mode";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PaletteProvider } from "@/components/Palette";
import "./globals.css";

const hanken = localFont({
  src: "./fonts/HankenGrotesk-latin-wght.woff2",
  weight: "100 900",
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(content.site.url),
  title: { default: `${content.site.title}: portfolio`, template: `%s | ${content.site.title}` },
  description: content.site.description,
  openGraph: {
    title: content.site.title,
    description: content.site.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b130f" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hanken.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MODE_SCRIPT }} />
      </head>
      <body>
        <PaletteProvider>
          <a className="skip" href="#main">
            Skip to content
          </a>
          <div id="page">
            <Header />
            <main id="main" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </div>
        </PaletteProvider>
      </body>
    </html>
  );
}
