const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const Player = require("./models/Player");

async function migrateRoles() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for migration...");

        const players = await Player.find({});
        console.log(`Found ${players.length} players to check.`);

        let updatedCount = 0;

        for (const player of players) {
            const oldRole = player.role;
            let newRole = player.role;

            // Normalization logic
            const r = oldRole.toUpperCase().replace(/\s+|-/g, "");

            if (r === "BATSMAN" || r === "BATTING") newRole = "Batsman";
            else if (r === "BOWLER" || r === "BOWLING") newRole = "Bowler";
            else if (r.includes("ALLROUNDER")) newRole = "All-rounder";
            else if (r === "WICKETKEEPER") newRole = "Wicket-keeper";

            if (newRole !== oldRole) {
                player.role = newRole;
                await player.save();
                console.log(`Updated ${player.name}: ${oldRole} -> ${newRole}`);
                updatedCount++;
            }
        }

        console.log(`Migration complete. Updated ${updatedCount} players.`);
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrateRoles();
