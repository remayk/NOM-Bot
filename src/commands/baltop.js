const { EmbedBuilder } = require("discord.js");
const { getBalanceLeaderboard } = require("../handlers/economy");

module.exports = {
	name: "baltop",
	// Function to execute the balance leaderboard command
	async execute(message, client) {
		try {
			// Fetch the balance leaderboard data
			const leaderboard = await getBalanceLeaderboard();

			// Create an embed message to display the balance leaderboard
			const embed = new EmbedBuilder()
				.setColor("#85bb65")
				.setTitle("No Motive")
				.setAuthor({ name: "Balance Leaderboard" })
				.setDescription("The Rich List")
				.setThumbnail(
					"https://cdn.discordapp.com/attachments/197213282493399041/1050966597688377426/no_motive.png"
				);

			// If there's no leaderboard data, display "No data available."
			if (leaderboard.length === 0) {
				embed.addFields({ name: "\u200B", value: "No data available." });
			} else {
				// Loop through the leaderboard and display each user's balance
				for (let i = 0; i < leaderboard.length; i++) {
					const user = await client.users.fetch(leaderboard[i].userId);
					const balance = leaderboard[i].balance;

					embed.addFields({
						name: "\u200B",
						value: `**#${i + 1}:** <@!${user.id}>\nBalance: $${balance.toFixed(
							2
						)}`, // Display rank, mention the user, and balance
						inline: false,
					});
				}
			}
			// Send the embed message
			message.channel.send({ embeds: [embed] });
		} catch (error) {
			console.error(
				"Error occurred while getting balance leaderboard: ",
				error
			);
			message.reply("Oops, something went wrong. Please try again.");
		}
	},
};
