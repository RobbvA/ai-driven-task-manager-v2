// app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Footer from "../components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "AI Task Manager",
  description:
    "Deterministic, explainable task prioritization — no external AI APIs.",
};

export default function RootLayout({ children }) {
  const year = new Date().getFullYear();

  return (
    <html lang="en">
      <body className={inter.variable}>
        <Providers>
          {children}
          <Footer year={year} />
        </Providers>
      </body>
    </html>
  );
}
