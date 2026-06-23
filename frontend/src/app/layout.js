import "./globals.css";
import { Toaster } from "sonner";
import { Poppins } from "next/font/google";

export const metadata = {
  title: "Employee Management System",
  description: "Modern Employee Management Dashboard",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body
        className={`${poppins.className} min-h-screen bg-slate-50 text-slate-900`}
      >
        <main className="min-h-screen">
          {children}
        </main>

        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 3000,
          }}
        />
      </body>
    </html>
  );
}