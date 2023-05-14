const { getBalance } = require("../handlers/economy");

module.exports = {
	name: "balance",
	// Function to execute the balance command
	async execute(message) {
		try {
			// Fetching the balance of the user who sent the message
			const balance = await getBalance(message.author.id);
			// Sending a reply to the user with their current balance
			message.reply(`Your current balance is $${balance.toFixed(2)}.`);
		} catch (error) {
			message.reply("Oops, something went wrong. Please try again.");
			console.error("Error occurred while fetching user balance: ", error);
		}
	},
};
