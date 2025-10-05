import "./globals.css";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { CartProvider } from "../context/CartContext";
import Script from "next/script";

export const metadata = {
  title: "Beanies On Business",
  description: "Official B.O.B site – community, merch, and DAO hub",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Light/Dark mode favicon support */}
        <link
          rel="icon"
          type="image/png"
          href="/favicon-dark.png"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-light.png"
          media="(prefers-color-scheme: light)"
        />

        {/* ✅ Existing favicon and manifest tags */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body>
        <CartProvider>
          <NavBar />
          <main>{children}</main>
          <Footer />
        </CartProvider>

        {/* ✅ Google Maps Autocomplete Script */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}