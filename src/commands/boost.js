const {
	getBoostTimeLeft,
	boostUser,
	boostEarnings,
} = require("../handlers/economy");

module.exports = {
	name: "boost",
	// Execute the boost command
	async execute(message) {
		try {
			// Get remaining boost time for the user
			const boostTimeLeft = getBoostTimeLeft(message.author.id);

			// If boost is active, inform the user
			if (boostTimeLeft > 0) {
				message.reply(
					`Your boost is still active! You have ${boostTimeLeft.toFixed(
						0
					)} seconds left.`
				);
				return;
			}

			// Activate a new boost for the user
			const result = await boostUser(message.author.id);

			// If the boost is successfully activated, inform the user
			if (result.success) {
				message.reply(
					`Your boost is now active! You can use "..mine" multiple times for ${result.boostDuration} seconds.`
				);

				// Set a timer to inform the user when the boost has ended
				setTimeout(() => {
					const remainingBoostTime = getBoostTimeLeft(message.author.id);
					if (remainingBoostTime === 0) {
						const totalEarnings = boostEarnings.get(message.author.id);
						if (totalEarnings) {
							message.reply(
								`Your boost has ended! You earned a total of $${totalEarnings.toFixed(
									2
								)} during the boost.`
							);
						}
					}
				}, result.boostDuration * 1000);
			} else {
				// If the user is on cooldown, inform them when they can use the boost again
				message.reply(
					`You have used up all your energy! Try again in ${result.cooldownLeft.toFixed(
						0
					)} minutes.`
				);
			}
		} catch (error) {
			message.reply("Oops, something went wrong. Please try again.");
			console.error("Error occurred while boosting user: ", error);
		}
	},
};
