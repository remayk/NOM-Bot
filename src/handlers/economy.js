const mongoose = require("../db");

// Economy Schema for storing user's balance
const economySchema = new mongoose.Schema({
	userId: { type: String, required: true, unique: true },
	balance: { type: Number, required: true },
});

const Economy = mongoose.model("Economy", economySchema);

// Function to generate a weighted random dollar amount for mining
function getRandomDollarAmount() {
	// Defining the weights and values for random dollar amounts
	const weights = Array(19).fill(1);
	const values = [];

	for (let i = 0; i < 19; i++) {
		const value = 0.25 + i * 0.25;
		values.push(value);
	}

	// Calculating the total weight and generating a random number
	const totalWeight = weights.reduce((a, b) => a + b, 0);
	const random = Math.random() * totalWeight;
	let weightSum = 0;

	// Determining the random dollar amount based on the generated random number
	for (let i = 0; i < 19; i++) {
		weightSum += weights[i];
		if (random < weightSum) {
			return values[i];
		}
	}
}

// Cooldown map for mining
const cooldowns = new Map();

// Boost maps
const boostCooldowns = new Map(); // Tracking boost cooldowns
const boostDurations = new Map(); // Tracking boost durations
const boostEarnings = new Map(); // Tracking boost earnings

// Function to boost a user's mining ability
async function boostUser(userId) {
	const boostDuration = 10 * 1000; // 10 seconds
	const boostCooldown = 60 * 60 * 1000; // 60 minutes

	const currentTime = Date.now();
	const lastBoost = boostCooldowns.get(userId);

	// Check if user is on cooldown
	if (lastBoost && currentTime < lastBoost + boostCooldown) {
		return {
			success: false,
			cooldownLeft: (lastBoost + boostCooldown - currentTime) / 60 / 1000, // Remaining cooldown in minutes
		};
	}

	// Setting the boost duration, cooldown, and reset earnings for the user
	boostDurations.set(userId, currentTime + boostDuration);
	boostCooldowns.set(userId, currentTime);
	boostEarnings.set(userId, 0);

	return {
		success: true,
		boostDuration: boostDuration / 1000, // Boost duration in seconds
		boostCooldown: boostCooldown / 1000, // Boost cooldown in seconds
	};
}

// Function to get the remaining boost time for a user
function getBoostTimeLeft(userId) {
	const currentTime = Date.now();
	const boostEndTime = boostDurations.get(userId);

	if (!boostEndTime || currentTime > boostEndTime) {
		return 0;
	}

	return (boostEndTime - currentTime) / 1000; // Remaining boost time in seconds
}

// Mine Function
async function mine(userId) {
	const currentTime = Date.now();
	const boostEndTime = boostDurations.get(userId);

	// Check if user's boost is active
	const isBoostActive = boostEndTime && currentTime < boostEndTime;

	// If boost is not active, apply the regular cooldown
	if (!isBoostActive) {
		const cooldownTime = 60; // 60 seconds
		const lastBoost = cooldowns.get(userId);

		if (lastBoost && currentTime < lastBoost + cooldownTime * 1000) {
			const timeLeft = (lastBoost + cooldownTime * 1000 - currentTime) / 1000;
			throw new Error(
				`You're too tired! Try again in ${timeLeft.toFixed(0)} seconds.`
			);
		}
		// Update the cooldown only when the boost is not active
		cooldowns.set(userId, currentTime);
	}

	const amount = getRandomDollarAmount();

	// Update user balance
	try {
		let user = await Economy.findOne({ userId });

		if (user) {
			user.balance += amount;
			await user.save();
		} else {
			user = new Economy({ userId, balance: amount });
			await user.save();
		}
	} catch (error) {
		throw new Error("An error occurred while updating your balance.");
	}

	// If the user is not on boost, update their cooldown
	if (!isBoostActive) {
		cooldowns.set(userId, currentTime);
	} else {
		const currentEarnings = boostEarnings.get(userId) || 0;
		boostEarnings.set(userId, currentEarnings + amount);
	}

	return {
		amount,
		isBoostActive,
	};
}

// Function to get a user's balance
async function getBalance(userId) {
	try {
		const user = await Economy.findOne({ userId });
		if (user) {
			return user.balance;
		} else {
			return 0;
		}
	} catch (error) {
		console.error("Error occurred while fetching user balance: ", error);
		throw new Error("An error occurred while checking your balance.");
	}
}

// Schema and model for gold leaderboard
const leaderboardSchema = new mongoose.Schema({
	userId: { type: String, required: true, unique: true },
	goldReceived: { type: Number, required: true },
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);

// Function to give gold to another user
async function giveGold(senderId, receiverId) {
	try {
		const sender = await Economy.findOne({ userId: senderId });
		if (!sender || sender.balance < 10) {
			throw new Error("You don't have enough balance to give Gold.");
		}

		sender.balance -= 10;
		await sender.save();

		// Add gold to the receiver's balance
		let receiver = await Economy.findOne({ userId: receiverId });
		if (!receiver) {
			receiver = new Economy({ userId: receiverId, balance: 10 });
		} else {
			receiver.balance += 10;
		}
		await receiver.save();

		// Update the leaderboard
		let leaderboardEntry = await Leaderboard.findOne({ userId: receiverId });
		if (!leaderboardEntry) {
			leaderboardEntry = new Leaderboard({
				userId: receiverId,
				goldReceived: 1,
			});
		} else {
			leaderboardEntry.goldReceived += 1;
		}
		await leaderboardEntry.save();

		return true;
	} catch (error) {
		console.error("Error occurred while giving Gold: ", error);
		throw new Error("An error occurred while giving Gold.");
	}
}

// Function to get the Gold leaderboard
async function getGoldLeaderboard() {
	try {
		const leaderboard = await Leaderboard.find({})
			.sort({ goldReceived: -1 })
			.limit(10);
		return leaderboard;
	} catch (error) {
		console.error("Error occurred while getting Gold leaderboard: ", error);
		throw new Error("An error occurred while getting the Gold leaderboard.");
	}
}

module.exports = {
	mine,
	getBalance,
	giveGold,
	getGoldLeaderboard,
	boostUser,
	getBoostTimeLeft,
	boostEarnings,
	boostCooldowns,
};
