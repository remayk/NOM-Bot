const { EmbedBuilder } = require("discord.js");
const { getReputationsLeaderboard } = require("../handlers/reputation");

module.exports = {
	name: "rep",
	// Function to execute the reputation leaderboard command
	async execute(message, client) {
		try {
			// Fetch the reputation leaderboard data
			const leaderboard = await getReputationsLeaderboard();

			// Create an embed message to display the reputation leaderboard
			const embed = new EmbedBuilder()
				.setColor("#0099ff")
				.setTitle("No Motive")
				.setAuthor({ name: "Reputation Leaderboard" })
				.setDescription("Most Reputation")
				.setThumbnail(client.user.displayAvatarURL());

			// If there's no leaderboard data, display "No data available."
			if (leaderboard.length === 0) {
				embed.addFields({ name: "\u200B", value: "No data available." });
			} else {
				// Loop through the leaderboard and display each user's reputation
				for (let i = 0; i < leaderboard.length; i++) {
					const user = await client.users.fetch(leaderboard[i].userId);
					const repValue = parseInt(leaderboard[i].reputation);

					embed.addFields({
						name: "\u200B",
						value: `**#${i + 1}:** <@!${user.id}>\nRep: ${repValue}`,
						inline: false,
					});
				}
			}

			message.channel.send({ embeds: [embed] });
		} catch (error) {
			console.error(
				"Error occurred while getting reputation leaderboard: ",
				error
			);
			message.reply("Oops, something went wrong. Please try again.");
		}
	},
};
