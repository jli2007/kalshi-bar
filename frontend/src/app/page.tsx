import BarCard from "@/components/BarCard";
import Navbar from "@/components/layout/Navbar";
import Map from "@/components/Map";
import { bars } from "@/data/bars";

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
