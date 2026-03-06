import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fateh Labs — Build. Ship. Win.",
  description: "Weekly coding challenges for young builders.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav className="nav container">
            <Link href="/" className="nav-logo">
              Fateh<span>Labs</span> 🚀
            </Link>
            <ul className="nav-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/challenge">Challenge</Link></li>
              <li><Link href="/submit">Submit</Link></li>
              <li><Link href="/leaderboard">Leaderboard</Link></li>
            </ul>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="footer">
          <p>© {new Date().getFullYear()} FatehLabs — Keep building! 🛠️</p>
        </footer>
      </body>
    </html>
  );
}
