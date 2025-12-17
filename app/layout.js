import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Driven Task Manager",
  description: "AI-powered task manager that turns chaos into clarity.",
};

export default function RootLayout({ children }) {
  const year = new Date().getFullYear(); // server computed → deterministic for hydration

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Sidebar />

          <div
            style={{
              marginLeft: "60px",
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <main style={{ flex: 1 }}>{children}</main>
            <Footer year={year} />
          </div>
        </Providers>
      </body>
    </html>
  );
}
