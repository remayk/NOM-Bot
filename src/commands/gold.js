const { giveGold, getGoldLeaderboard } = require("../handlers/economy");
const { EmbedBuilder } = require("discord.js");

// Function to execute the "..gold" command
async function execute(message, client) {
	// Check if the command is "..gold"
	if (message.content === "..gold") {
		try {
			// Fetch the Gold leaderboard data
			const leaderboard = await getGoldLeaderboard();

			// Create an embed message to display the gold leaderboard
			const embed = new EmbedBuilder()
				.setColor("#FFD700")
				.setTitle("No Motive")
				.setAuthor({ name: "Gold Leaderboard" })
				.setDescription("Most Gold Received")
				.setThumbnail(
					"https://cdn.discordapp.com/attachments/197213282493399041/1050966597688377426/no_motive.png"
				);

			// If there is no leaderboard data, display "No data available."
			if (leaderboard.length === 0) {
				embed.addFields({ name: "\u200B", value: "No data available." });
			} else {
				// Loop through the leaderboard and display each user's Gold count
				for (let i = 0; i < leaderboard.length; i++) {
					const medalEmoji =
						i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "";
					const user = await client.users.fetch(leaderboard[i].userId);
					const gold = leaderboard[i].goldReceived;

					embed.addFields({
						name: "\u200B",
						value: `${medalEmoji} <@!${user.id}>\nGold: \`${gold}\``, // Display medal emoji, mention the user, and Gold count
						inline: false,
					});
				}
			}
			// Send the embed message
			message.channel.send({ embeds: [embed] });
		} catch (error) {
			console.error("Error occurred while getting Gold leaderboard: ", error);
			message.reply("Oops, something went wrong. Please try again.");
		}
	}
}

// Function to give gold to another user by reacting to their message
async function giveGoldByReaction(targetMessage, user) {
	const targetUser = targetMessage.author;

	// Check if user is trying to give gold to themselves
	if (targetUser.id === user.id) {
		targetMessage.channel.send(
			`Wow, ${user.username}, trying to give yourself gold.. Imagine.`
		);
		return;
	}

	try {
		// Give gold to the target user and update the user's balance
		const success = await giveGold(user.id, targetUser.id);
		if (success) {
			targetMessage.channel.send(
				`${user.username} gave ${targetUser.username} Gold! ${user.username}'s balance has been reduced by $25.`
			);
		}
	} catch (error) {
		console.error("Error occurred while giving Gold: ", error);
	}
}

module.exports = {
	execute: execute,
	giveGoldByReaction,
};
