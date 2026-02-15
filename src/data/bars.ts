export interface Bar {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  coordinates: [number, number]; // [lng, lat]
  website?: string;
  image: string;
  events: string[];
}

export const bars: Bar[] = [
  {
    name: "Finnerty's",
    address: "18 W 33rd St",
    city: "New York",
    state: "NY",
    zip: "10001",
    coordinates: [-73.9876, 40.7484],
    image:
      "https://images.squarespace-cdn.com/content/v1/6686f05807c6546ad9722019/0ca76781-1ff7-4531-b98b-a06b8752cde5/Finns_Op1.jpg",
    events: ["Champions League", "March Madness"],
  },
  {
    name: "Stan's Sports Bar",
    address: "836 River Ave",
    city: "New York",
    state: "NY",
    zip: "10451",
    coordinates: [-73.9262, 40.8296],
    image:
      "https://stanssportsbar.com/wp-content/uploads/2022/04/Stans-Logo-Darker-2.png",
    events: ["Yankees Watch Party", "NBA Finals"],
  },
  {
    name: "The Hairy Lemon",
    address: "28 Avenue B",
    city: "New York",
    state: "NY",
    zip: "10009",
    coordinates: [-73.9838, 40.7252],
    image:
      "https://static.wixstatic.com/media/bd42b5_0200e2aa79f941abaebe75bb7dbec197~mv2.png",
    events: ["Premier League", "UFC Fight Night"],
  },
  {
    name: "Stout",
    address: "90 John St",
    city: "New York",
    state: "NY",
    zip: "10038",
    coordinates: [-74.0063, 40.7085],
    image:
      "https://images.getbento.com/accounts/b6bbbbf288efff1f22635abb9e9f66ce/media/images/541946986logo.png",
    events: ["NFL Sunday Ticket", "March Madness", "Oscars Watch Party"],
  },
  {
    name: "Harlem Tavern",
    address: "2153 Frederick Douglass Blvd",
    city: "New York",
    state: "NY",
    zip: "10026",
    coordinates: [-73.9558, 40.8027],
    image:
      "https://res.cloudinary.com/spothopper/image/fetch/f_auto,q_auto:best,c_fit,h_1200/http://static.spotapps.co/spots/5a/148a1be4654f4d8d6b2d8a3a10a067/:original",
    events: ["NFL Sunday Ticket", "Champions League"],
  },
  {
    name: "The Irish American",
    address: "17 John St",
    city: "New York",
    state: "NY",
    zip: "10038",
    coordinates: [-74.0063, 40.7088],
    image:
      "https://images.squarespace-cdn.com/content/v1/663bdcf068c65c071caa1820/76fd80e6-0a1d-4002-9ad0-3dee4e3f7d08/IRISH_AMERICAN_LOGO_Y.png",
    events: ["NFL Sunday Ticket", "Oscars Watch Party"],
  },
  {
    name: "Blue Haven",
    address: "108 W Houston St",
    city: "New York",
    state: "NY",
    zip: "10012",
    coordinates: [-74.0003, 40.7275],
    image:
      "https://static.spotapps.co/web/bluehavennyc--com/custom/video_poster.jpg",
    events: ["Champions League", "March Madness", "Oscars Watch Party"],
  },
  {
    name: "Rocco's Sport & Recreation",
    address: "1 W 3rd St",
    city: "New York",
    state: "NY",
    zip: "10012",
    coordinates: [-73.9991, 40.7307],
    image:
      "https://images.squarespace-cdn.com/content/v1/61f061a8e8c8555a87925de0/0070fd65-fa1c-4f46-bff6-8cdf1553b3f4/rsr-cream+%281%29.png",
    events: ["NBA Finals", "NFL Sunday Ticket", "World Cup"],
  },
  {
    name: "Turnmill Bar",
    address: "119 E 27th St",
    city: "New York",
    state: "NY",
    zip: "10016",
    coordinates: [-73.9837, 40.7418],
    image:
      "https://images.getbento.com/s8kP7h64RGak2h4PbJZy_logo-whit.png",
    events: ["Premier League", "Champions League"],
  },
  {
    name: "Cork & Batter",
    address: "3900 W Century Blvd",
    city: "Inglewood",
    state: "CA",
    zip: "90303",
    coordinates: [-118.3282, 33.9461],
    image:
      "https://cp1.inkrefuge.com/admin/asset/uploads/551/on_page_element/cb-logo.png",
    events: ["NFL Sunday Ticket", "NBA Finals", "UFC Fight Night"],
  },
  {
    name: "Fatpour Tap Works",
    address: "2206 W Division St",
    city: "Chicago",
    state: "IL",
    zip: "60622",
    coordinates: [-87.6829, 41.9030],
    image:
      "https://fatpourtapworks.com/wp-content/uploads/sites/8/2024/12/wicker-724x452.jpeg",
    events: ["Bears Watch Party", "NBA Finals", "March Madness"],
  },
  {
    name: "Theory",
    address: "9 W Hubbard St",
    city: "Chicago",
    state: "IL",
    zip: "60654",
    coordinates: [-87.6298, 41.8901],
    image:
      "https://www.theorychicago.com/wp-content/uploads/2021/09/chicago-sports-lounge.png",
    events: ["UFC Fight Night", "Champions League", "Oscars Watch Party"],
  },
];
