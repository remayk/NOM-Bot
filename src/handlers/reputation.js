const mongoose = require("../db");

// Reputation Schema for storing user's reputation
const reputationSchema = new mongoose.Schema({
	userId: { type: String, required: true, unique: true },
	reputation: { type: Number, required: true },
});

const Reputation = mongoose.model("Reputation", reputationSchema);

// Function to update a user's reputation
async function updateReputation(userId, delta) {
	try {
		let userRep = await Reputation.findOne({ userId });

		if (userRep) {
			userRep.reputation += delta;
			await userRep.save();
		} else {
			userRep = new Reputation({ userId, reputation: 1 + delta });
			await userRep.save();
		}

		return userRep.reputation;
	} catch (error) {
		console.error("Error occurred while updating user's reputation:", error);
		throw error;
	}
}

// Function to get Reputation Leaderboard
async function getReputationsLeaderboard() {
	try {
		const leaderboardData = await Reputation.find({})
			.sort({ reputation: -1 })
			.limit(10);
		return leaderboardData;
	} catch (error) {
		console.error(
			"Error occurred while getting reputation leaderboard:",
			error
		);
		throw error;
	}
}

module.exports = {
	updateReputation,
	getReputationsLeaderboard,
};
