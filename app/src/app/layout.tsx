import { FaviconLinks } from "@/components/FaviconLinks";
import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Wide bold grotesk for the Project Blue word-mark — a free, reliable
// stand-in for Neue Haas Grotesk Display.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Project Blue",
    template: "%s — Project Blue",
  },
  description:
    "Listen together — even when you're apart. A quiet place to play music in time with someone else.",
  applicationName: "Project Blue",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Project Blue",
  },
};

export const viewport: Viewport = {
  themeColor: "#050506",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <FaviconLinks />
        {/* Boot the saved theme before paint so we don't flash the wrong
            palette. Dark-first everywhere; light only if the visitor chose it. */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('pb-theme');
                if (t !== 'light') t = 'dark';
                document.documentElement.setAttribute('data-theme', t);
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${archivo.variable}`}
      >
        <a href="#main" className="pb-skip">Skip to main content</a>
        {children}
        <Toaster position="bottom-center" theme="dark" />
      </body>
    </html>
  );
}
