import { bars, type Bar } from "./bars";

export interface Event {
  id: string;
  name: string;
  category: string;
  date: string;
  time: string;
  description: string;
  image: string;
}

export const events: Event[] = [
  {
    id: "oscars-watch-party",
    name: "Oscars Watch Party",
    category: "Entertainment",
    date: "March 2, 2025",
    time: "8:00 PM EST",
    description: "Join us for the 97th Academy Awards! Watch the biggest night in Hollywood with fellow film lovers.",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800",
  },
  {
    id: "champions-league",
    name: "Champions League",
    category: "Soccer",
    date: "Feb 18, 2025",
    time: "3:00 PM EST",
    description: "UEFA Champions League knockout rounds. Experience the drama of European football's premier competition.",
    image: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800",
  },
  {
    id: "nba",
    name: "NBA",
    category: "Basketball",
    date: "June 5, 2025",
    time: "9:00 PM EST",
    description: "The culmination of the NBA season. Watch the best teams battle for the championship.",
    image: "https://images.unsplash.com/photo-1563506644863-444710df1e03?w=800",
  },
  {
    id: "nfl-sunday-ticket",
    name: "NFL Sunday Ticket",
    category: "Football",
    date: "Every Sunday",
    time: "1:00 PM EST",
    description: "Catch all the NFL action every Sunday. Every game, every play.",
    image: "https://images.unsplash.com/photo-1732853089231-b02c92052eee?w=800",
  },
  {
    id: "march-madness",
    name: "March Madness",
    category: "Basketball",
    date: "March 18, 2025",
    time: "12:00 PM EST",
    description: "NCAA Tournament action! Experience the madness of college basketball's biggest event.",
    image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800",
  },
  {
    id: "ufc-fight-night",
    name: "UFC Fight Night",
    category: "MMA",
    date: "Feb 22, 2025",
    time: "10:00 PM EST",
    description: "Live UFC action featuring top fighters in the octagon.",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800",
  },
  {
    id: "premier-league",
    name: "Premier League",
    category: "Soccer",
    date: "Every Weekend",
    time: "10:00 AM EST",
    description: "English Premier League matches featuring the best clubs in England.",
    image: "https://images.unsplash.com/photo-1683838946268-e0db005a09b4?w=800",
  },
  {
    id: "world-cup",
    name: "World Cup",
    category: "Soccer",
    date: "TBD 2026",
    time: "Various",
    description: "FIFA World Cup 2026 hosted in North America. The biggest sporting event on the planet.",
    image: "https://images.unsplash.com/photo-1670409693465-5c8fe03c6054?w=800",
  },
];

export function getBarsForEvent(eventName: string): Bar[] {
  return bars.filter((bar) => bar.events.includes(eventName));
}

export function getEventById(id: string): Event | undefined {
  return events.find((event) => event.id === id);
}
