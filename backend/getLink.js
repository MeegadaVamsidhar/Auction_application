const mongoose = require("mongoose");
require("dotenv").config();

const getLink = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Settings = mongoose.connection.db.collection("settings");
    const setting = await Settings.findOne({ key: "player_list_link" });
    if (setting) {
      console.log("PLAYER_LIST_LINK:", setting.value);
    } else {
      console.log("No player list link found in settings.");
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.connection.close();
  }
};

getLink();
