export interface Bar {
  name: string;
  address: string;
  location: string;
  coordinates: [number, number]; // [lng, lat]
  image: string;
  website: string;
  events: string[];
  tags: string[];
}

export const bars: Bar[] = [
  {
    name: "Brickyard Craft kitchen & Bar",
    address: "23 Park Pl",
    location: "New York, NY",
    coordinates: [-74.0082, 40.7133],
    image:
      "https://static.spotapps.co/website_images/ab_websites/117295_website/video_poster.jpg",
    website: "https://brickyardbarnyc.com/",
    events: ["Oscars Watch Party", "NFL Sunday Ticket"],
    tags: ["Craft kitchen", "Top rated"],
  },
  {
    name: "Finnerty's",
    address: "18 W 33rd St",
    location: "New York, NY",
    coordinates: [-73.9876, 40.7484],
    image:
      "https://images.squarespace-cdn.com/content/v1/6686f05807c6546ad9722019/0ca76781-1ff7-4531-b98b-a06b8752cde5/Finns_Op1.jpg",
    website: "https://www.finnertysnyc.com/",
    events: ["Champions League", "March Madness"],
    tags: ["Trendy", "Fan favorite"],
  },
  {
    name: "Stan's Sports Bar",
    address: "836 River Ave",
    location: "Bronx, NY",
    coordinates: [-73.9262, 40.8296],
    image:
      "https://stanssportsbar.com/wp-content/uploads/2022/04/Stans-Logo-Darker-2.png",
    website: "https://stanssportsbar.com/",
    events: ["Yankees Watch Party", "NBA Finals"],
    tags: ["Classic", "Legendary"],
  },
  {
    name: "The Hairy Lemon",
    address: "28 Avenue B",
    location: "New York, NY",
    coordinates: [-73.9838, 40.7252],
    image:
      "https://static.wixstatic.com/media/bd42b5_0200e2aa79f941abaebe75bb7dbec197~mv2.png",
    website: "https://www.hairylemonnyc.com/",
    events: ["Premier League", "UFC Fight Night"],
    tags: ["Dive bar", "Late night"],
  },
  {
    name: "Stout",
    address: "90 John St",
    location: "New York, NY",
    coordinates: [-74.0063, 40.7085],
    image:
      "https://images.getbento.com/accounts/b6bbbbf288efff1f22635abb9e9f66ce/media/images/541946986logo.png",
    website: "https://www.stoutnyc.com/",
    events: ["NFL Sunday Ticket", "March Madness", "Oscars Watch Party"],
    tags: ["Top rated", "Big screens"],
  },
  {
    name: "Harlem Tavern",
    address: "2153 Frederick Douglass Blvd",
    location: "New York, NY",
    coordinates: [-73.9558, 40.8027],
    image:
      "https://res.cloudinary.com/spothopper/image/fetch/f_auto,q_auto:best,c_fit,h_1200/http://static.spotapps.co/spots/5a/148a1be4654f4d8d6b2d8a3a10a067/:original",
    website: "https://harlemtavern.com/",
    events: ["NFL Sunday Ticket", "Champions League"],
    tags: ["Outdoor patio", "Trendy"],
  },
  {
    name: "The Irish American",
    address: "17 John St",
    location: "New York, NY",
    coordinates: [-74.0063, 40.7088],
    image:
      "https://images.squarespace-cdn.com/content/v1/663bdcf068c65c071caa1820/76fd80e6-0a1d-4002-9ad0-3dee4e3f7d08/IRISH_AMERICAN_LOGO_Y.png",
    website: "https://www.irishamericanpubnyc.com/",
    events: ["NFL Sunday Ticket", "Oscars Watch Party"],
    tags: ["Classic", "Pub grub"],
  },
  {
    name: "Blue Haven",
    address: "108 W Houston St",
    location: "New York, NY",
    coordinates: [-74.0003, 40.7275],
    image:
      "https://static.spotapps.co/web/bluehavennyc--com/custom/video_poster.jpg",
    website: "https://bluehavennyc.com/",
    events: ["Champions League", "March Madness", "Oscars Watch Party"],
    tags: ["Trendy", "Craft cocktails"],
  },
  {
    name: "Rocco's Sport & Recreation",
    address: "1 W 3rd St",
    location: "New York, NY",
    coordinates: [-73.9991, 40.7307],
    image:
      "https://images.squarespace-cdn.com/content/v1/61f061a8e8c8555a87925de0/0070fd65-fa1c-4f46-bff6-8cdf1553b3f4/rsr-cream+%281%29.png",
    website: "https://www.gotoroccos.com/",
    events: ["NBA Finals", "NFL Sunday Ticket", "World Cup"],
    tags: ["Trendy", "Fan favorite"],
  },
  {
    name: "Turnmill Bar",
    address: "119 E 27th St",
    location: "New York, NY",
    coordinates: [-73.9837, 40.7418],
    image:
      "https://images.getbento.com/s8kP7h64RGak2h4PbJZy_logo-whit.png",
    website: "https://www.turnmillnyc.com/",
    events: ["Premier League", "Champions League"],
    tags: ["Upscale", "Craft cocktails"],
  },
  {
    name: "The Banshee",
    address: "934 Dorchester Ave",
    location: "Boston, MA",
    coordinates: [-71.0595, 42.3020],
    image:
      "https://www.bansheeboston.com/wp-content/uploads/2025/11/Banshee-Chelsea-v-Liverpool-e1763066339392.jpg",
    website: "https://www.bansheeboston.com/",
    events: ["Premier League", "Champions League", "World Cup"],
    tags: ["Fan favorite", "Late night"],
  },
  {
    name: "Cask 'n Flagon",
    address: "62 Brookline Ave",
    location: "Boston, MA",
    coordinates: [-71.0975, 42.3467],
    image:
      "https://casknflagon.com/wp-content/uploads/2024/03/Cask-N-Flagon-Shamrock-Showdown-3-16-24-5.jpeg",
    website: "https://casknflagon.com/",
    events: ["NFL Sunday Ticket", "MLB Playoffs", "March Madness"],
    tags: ["Legendary", "Big screens"],
  },
  {
    name: "Bleacher Bar",
    address: "82A Lansdowne St",
    location: "Boston, MA",
    coordinates: [-71.0968, 42.3471],
    image:
      "https://images.getbento.com/accounts/5e3610b7be583b3edeaaf7e8624551ab/media/images/55385bb-logo.png",
    website: "https://www.bleacherbarboston.com/",
    events: ["MLB Playoffs", "NFL Sunday Ticket", "World Cup"],
    tags: ["Top rated", "Iconic"],
  },
  {
    name: "Tony C's Sports Bar & Grill",
    address: "250 Northern Ave",
    location: "Boston, MA",
    coordinates: [-71.0422, 42.3480],
    image:
      "https://www.tonycssportsbar.com/wp-content/uploads/2024/08/DSC03355-scaled-e1765322120731.jpg",
    website: "https://www.tonycssportsbar.com/",
    events: ["NBA Finals", "NFL Sunday Ticket", "March Madness"],
    tags: ["Big screens", "Pub grub"],
  },
  {
    name: "Chickie's & Pete's",
    address: "1526 Packer Ave",
    location: "Philadelphia, PA",
    coordinates: [-75.1720, 39.9073],
    image:
      "https://cdn.sanity.io/images/78e278ym/production/cae8aed6abf549b2f822a216ad2955485266f123-1980x1080.jpg",
    website: "https://www.chickiesandpetes.com/",
    events: ["NFL Sunday Ticket", "MLB Playoffs", "NBA Finals"],
    tags: ["Legendary", "Fan favorite"],
  },
  {
    name: "McGillin's Olde Ale House",
    address: "1310 Drury St",
    location: "Philadelphia, PA",
    coordinates: [-75.1613, 39.9520],
    image:
      "https://mcgillins.com/wp-content/uploads/2015/11/mcgillins-logo-large.png",
    website: "https://mcgillins.com/",
    events: ["World Cup", "NFL Sunday Ticket", "MLB Playoffs"],
    tags: ["Historic", "Classic"],
  },
  {
    name: "Misconduct Tavern",
    address: "1511 Locust St",
    location: "Philadelphia, PA",
    coordinates: [-75.1666, 39.9487],
    image:
      "https://misconducttavern.com/wp-content/uploads/2019/04/misconduct-logo.png",
    website: "https://misconducttavern.com/",
    events: ["Premier League", "Champions League", "NFL Sunday Ticket"],
    tags: ["Trendy", "Late night"],
  },
  {
    name: "Tom's Watch Bar",
    address: "1300 1st St SE",
    location: "Washington, DC",
    coordinates: [-77.0075, 38.8753],
    image:
      "https://tomswatchbar.com/wp-content/uploads/2025/02/Toms-Watch-Bar-logo-white-1-1.png",
    website: "https://tomswatchbar.com/navy-yard/",
    events: ["March Madness", "NBA Finals", "NFL Sunday Ticket"],
    tags: ["Big screens", "Top rated"],
  },
  {
    name: "Exiles Bar",
    address: "1610 U St NW",
    location: "Washington, DC",
    coordinates: [-77.0362, 38.9170],
    image:
      "https://images.squarespace-cdn.com/content/v1/5db731dc71de2b13a3655655/1572464586176-84XZ3S1EI4635FG3UD5D/exiles-logo.png",
    website: "https://www.exilesbar.com/",
    events: ["Premier League", "Champions League", "World Cup"],
    tags: ["Fan favorite", "Dive bar"],
  },
  {
    name: "Over Under",
    address: "1004 Mount Vernon Pl NW",
    location: "Washington, DC",
    coordinates: [-77.0241, 38.9054],
    image:
      "https://img1.wsimg.com/isteam/ip/2fb10d8a-1684-4050-9f69-1ffbeb786456/Over-Under-Sportsbook-Rooftop-Lounge-008_20025.jpg",
    website: "https://overunderdc.com/",
    events: ["UFC Fight Night", "NFL Sunday Ticket", "NBA Finals"],
    tags: ["Upscale", "Rooftop"],
  },
  {
    name: "Pickles Pub",
    address: "520 Washington Blvd",
    location: "Baltimore, MD",
    coordinates: [-76.6217, 39.2849],
    image:
      "https://baltimore.org/wp-content/uploads/2020/04/IMG_0332_BA95F700-97E9-4E30-91444EDD733B6295_6ca72c23-8e18-4e05-9765e329ed76a3df-850x750-c-center.jpg",
    website: "https://www.picklespub.com/",
    events: ["MLB Playoffs", "NFL Sunday Ticket", "March Madness"],
    tags: ["Classic", "Legendary"],
  },
  {
    name: "Asbury Ale House",
    address: "531 Cookman Ave",
    location: "Asbury Park, NJ",
    coordinates: [-74.0001, 40.2205],
    image:
      "https://asburyalehouse.com/wp-content/uploads/2023/10/aah-logo.png",
    website: "https://asburyalehouse.com/",
    events: ["NFL Sunday Ticket", "UFC Fight Night", "March Madness"],
    tags: ["Dive bar", "Craft cocktails"],
  },
  {
    name: "The Trinity Bar",
    address: "157 Orange St",
    location: "New Haven, CT",
    coordinates: [-72.9279, 41.3083],
    image:
      "https://res.cloudinary.com/gonation/w_1800/q_auto/f_auto/gonation.data.dev/pgrc5qlio3dmx5pquxyl",
    website: "https://www.thetrinitybar.com/",
    events: ["Premier League", "Champions League", "UFC Fight Night"],
    tags: ["Top rated", "Late night"],
  },
];
