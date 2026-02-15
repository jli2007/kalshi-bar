import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import Navbar from "@/components/layout/Navbar";
import { ShineBorder } from "@/components/ui/ShineBorder";
import MarketsSection from "@/components/MarketsSection";
import { getEventById, getBarsForEvent } from "@/data/events";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }

  const bars = getBarsForEvent(event.name);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Back link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-kalshi-text-secondary hover:text-white mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Events
        </Link>

        {/* Event header */}
        <div className="relative rounded-xl bg-kalshi-card overflow-hidden mb-8">
          <ShineBorder shineColor="#28CC95" borderWidth={1} duration={10} className="z-10 opacity-70" />

          <div className="relative">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-kalshi-card via-transparent to-transparent" />
            <span className="absolute top-4 left-4 rounded-sm border border-kalshi-green/70 bg-kalshi-card/80 backdrop-blur-sm px-2.5 py-1 text-sm font-medium text-kalshi-green">
              {event.category}
            </span>
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-white">{event.name}</h1>
            <p className="mt-2 text-kalshi-green text-lg">
              {event.date} • {event.time}
            </p>
            <p className="mt-4 text-kalshi-text-secondary">
              {event.description}
            </p>
          </div>
        </div>

        {/* Kalshi Markets section */}
        <MarketsSection eventId={id} eventName={event.name} category={event.category} />

        {/* Bars section */}
        <h2 className="text-xl font-bold text-white mb-4">
          {bars.length} Bar{bars.length !== 1 ? "s" : ""} Showing This Event
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bars.map((bar) => (
            <div
              key={bar.name}
              className="relative rounded-xl bg-kalshi-card overflow-hidden"
            >
              <ShineBorder shineColor="#28CC95" borderWidth={1} duration={10} className="z-10 opacity-50" />

              {bar.image ? (
                <div className="relative">
                  <img
                    src={bar.image}
                    alt={bar.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-kalshi-card to-transparent" />
                </div>
              ) : (
                <div className="w-full h-32 bg-gradient-to-br from-kalshi-green/20 to-kalshi-green/5 flex items-center justify-center">
                  <span className="text-4xl text-kalshi-green/50 font-bold">{bar.name[0]}</span>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-white">{bar.name}</h3>
                  <a
                    href={bar.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 shrink-0 text-kalshi-green transition-opacity hover:opacity-70"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                  </a>
                </div>
                <p className="mt-1 text-sm text-kalshi-text-secondary">
                  {bar.address}, {bar.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
