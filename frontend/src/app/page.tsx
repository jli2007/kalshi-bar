import BarCard from "@/components/BarCard";
import Navbar from "@/components/layout/Navbar";
import Map from "@/components/Map";
import { bars, type Bar } from "@/data/bars";
import { ChevronRightIcon } from "@radix-ui/react-icons";

const categories = [
  { name: "Soccer", events: ["Champions League", "Premier League", "World Cup"] },
  { name: "Basketball", events: ["NBA Finals", "March Madness"] },
  { name: "Football", events: ["NFL Sunday Ticket"] },
  { name: "UFC", events: ["UFC Fight Night"] },
  {
    name: "Watch Parties",
    events: [
      "Oscars Watch Party",
      "Yankees Watch Party",
      "Mets Watch Party",
      "Cubs Watch Party",
      "Bears Watch Party",
      "Lakers Watch Party",
      "MLB Playoffs",
    ],
  },
];

function getBarsForCategory(events: string[]): Bar[] {
  return bars.filter((bar) =>
    bar.events.some((event) => events.includes(event))
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="h-[calc(100vh-3.5rem)] w-full">
        <Map />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {categories.map((category, index) => {
          const categoryBars = getBarsForCategory(category.events);
          if (categoryBars.length === 0) return null;
          return (
            <section key={category.name}>
              {index > 0 && <hr className="my-6 border-kalshi-border" />}
              <h2 className="mb-3 flex items-center gap-1 text-lg font-semibold text-white">
                {category.name}
                <ChevronRightIcon className="h-5 w-5" />
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryBars.slice(0, 3).map((bar) => (
                  <BarCard key={bar.name} bar={bar} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
