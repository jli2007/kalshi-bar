import Navbar from "@/components/layout/Navbar";
import EventCard from "@/components/EventCard";
import { events, getBarsForEvent } from "@/data/events";

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">Events</h1>
        <p className="text-kalshi-text-secondary mb-8">
          Find bars showing your favorite events
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              bars={getBarsForEvent(event.name)}
            />
          ))}
        </div>
      </main>
    </>
  );
}
