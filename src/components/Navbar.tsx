"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className={`flex gap-4 p-4 border-b ${
        theme === "dark"
          ? "bg-black text-white border-gray-700"
          : "bg-white text-black border-gray-300"
      }`}
    >
      <Link href="/" className={pathname === "/" ? "font-bold" : ""}>
        Home
      </Link>
      <Link href="/favorites" className={pathname === "/favorites" ? "font-bold" : ""}>
        Favourite
      </Link>

      <button
        onClick={toggleTheme}
        className="ml-auto border px-3 py-1 rounded"
      >
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>
    </nav>
  );
}
