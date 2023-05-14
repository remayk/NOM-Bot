const { mine } = require("../handlers/economy");

module.exports = {
	name: "mine",
	// Execute the mine command
	async execute(message) {
		try {
			// Call the mine function with the message author's ID
			const result = await mine(message.author.id);

			// If the user is not on a boost, send a message with the amount of money they mined
			if (!result.isBoostActive) {
				message.reply(`You mined $${result.amount.toFixed(2)}!`);
			}
			// Return the result
			return result;
		} catch (error) {
			message.reply(error.message);
			return;
		}
	},
};
