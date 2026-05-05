import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 pt-16 pb-8">
        Main Page
      </main>
      <Footer />
    </div>
  );
}
