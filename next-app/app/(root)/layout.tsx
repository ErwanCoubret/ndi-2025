import Footer from "../components/utils/Footer";
import Navbar from "../components/utils/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white text-slate-500">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
