import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LandingPage from "@/components/sections/LandingPage";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <LandingPage/>
      <Footer />
    </div>
  );
}