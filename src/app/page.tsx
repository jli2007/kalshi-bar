import Navbar from "@/components/layout/Navbar";
import Map from "@/components/Map";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Map />
      </main>
    </div>
  );
}
