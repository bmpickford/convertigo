import fs from "fs";
import { v4 } from "uuid";
const stream = fs.createWriteStream("data.jsonl");

const users = 500;
const items = 1000;

const pSearch = 0.8;
const pView = 0.8;
const pAdd = 0.3;
const pConvert = 0.6;
const searches = [
  "Women's clothing sale",
  "Men's shoes clearance",
  "Best iPhone accessories",
  "Organic skincare products",
  "Baby clothes online",
  "Fitness equipment deals",
  "Home decor ideas",
  "Kitchen gadgets and appliances",
  "Sustainable fashion brands",
  "Personalized gift ideas",
  "Plus size clothing for women",
  "Best headphones under $100",
  "Outdoor gear and accessories",
  "Gaming laptops on sale",
  "Eco-friendly home products",
  "Workout clothes for men",
  "Affordable jewelry online",
  "Healthy snacks and supplements",
  "Hair care products for curly hair",
  "Kids toys and games",
  "Home office furniture",
  "Women's athletic wear",
  "CBD products for pets",
  "Car accessories and gadgets",
  "Designer handbags on sale",
  "Men's grooming products",
  "Best backpacks for travel",
  "Women's shoes online",
  "Affordable watches for men",
  "Health and wellness products",
  "Pet food and treats online",
  "Phone cases and accessories",
  "Outdoor furniture and decor",
  "Women's swimwear sale",
  "Fitness trackers and smartwatches",
  "Men's dress shirts online",
  "Unique home decor items",
  "Vegan food and snacks",
  "Hair accessories and styling tools",
  "Organic baby products",
  "Laptop bags and cases",
  "Women's sunglasses online",
  "Best budget laptops",
  "Men's sunglasses online",
  "DIY home improvement supplies",
  "Designer sunglasses on sale",
  "Yoga mats and accessories",
  "Home cleaning and organization products",
  "Affordable dresses for women",
  "Men's wallets and accessories",
];

for (const u in new Array(users).fill(0)) {
  const user = (parseInt(u) + 1).toString();
  const search = Math.random() < pSearch;
  const view = Math.random() < pView;
  const add = Math.random() < pAdd;
  const convert = Math.random() < pConvert;
  const item_id = (Math.floor(Math.random() * items) + 1).toString();

  if (search) {
    const event = {
      type: "search",
      id: v4(),
      user,
      timestamp: new Date().getTime(),
      query: searches[Math.floor(Math.random() * searches.length)],
    };
    stream.write(JSON.stringify(event));
    stream.write("\n");
  }

  if (view) {
    const event = {
      type: "view",
      id: v4(),
      user,
      timestamp: new Date().getTime(),
      item_id,
    };
    stream.write(JSON.stringify(event));
    stream.write("\n");
  }

  if (add) {
    const event = {
      type: "add_to_cart",
      id: v4(),
      user,
      timestamp: new Date().getTime(),
      item_id,
    };
    stream.write(JSON.stringify(event));
    stream.write("\n");

    if (convert) {
      const event = {
        type: "conversion",
        id: v4(),
        user,
        timestamp: new Date().getTime(),
        item_id,
      };
      stream.write(JSON.stringify(event));
      stream.write("\n");
    }
  }
}

stream.end();
