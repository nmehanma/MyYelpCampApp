const mongoose = require("mongoose"); // run this file everytime we want to refresh our database with new campgrounds
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/myyelpcamp", {
  useNewURLParser: true,
  useUnifiedtopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      //YOUR USERID
      author: "61d4aee355617cdcfa633c6a",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url:
            "https://res.cloudinary.com/doqlk4ocr/image/upload/v1641528293/YelpCamp/s8qg5sy2jmj6vwxe12yr.png",
          filename: "YelpCamp/s8qg5sy2jmj6vwxe12yr"
        },
        {
          url:
            "https://res.cloudinary.com/doqlk4ocr/image/upload/v1641528293/YelpCamp/l22rth0xezcjahzepadz.png",
          filename: "YelpCamp/l22rth0xezcjahzepadz"
        }
      ],
      // image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ducimus qui at fugit dolorem rem. Nulla aspernatur asperiores, fugit placeat velit omnis doloribus est quam similique harum praesentium iusto fugiat minus.",
      price,
      geometry: { type: "Point", coordinates: [-79.383935, 43.653482] }
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
