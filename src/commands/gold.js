const {
	giveGold,
	getGoldLeaderboard,
	getUserGold,
	getBalance,
} = require("../handlers/economy");
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
				// Loop through the leaderboard and display each user's Gold count and balance
				for (let i = 0; i < leaderboard.length; i++) {
					const medalEmoji =
						i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "";
					const user = await client.users.fetch(leaderboard[i].userId);
					const gold = leaderboard[i].goldReceived;
					const balance = await getBalance(user.id);

					embed.addFields({
						name: "\u200B",
						value: `${medalEmoji} <@!${
							user.id
						}>\nGold: \`${gold}\`\nBal: \`$${balance.toFixed(2)}\``, // Display medal emoji, mention the user, Gold count, and balance
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
		await giveGold(user.id, targetUser.id);

		// Get the total gold amount for the recipient
		const totalGoldAmount = await getUserGold(targetUser.id);

		targetMessage.channel.send(
			`<@${targetUser.id}>, you got Gold from <@${user.id}>! You've gotten ${totalGoldAmount} so far.`
		);
	} catch (error) {
		// Only throw the error if it's not an insufficient balance error
		if (error.message !== "You don't have enough balance to give Gold.") {
			throw error;
		}
		// Send a custom error message to the user in the chat
		targetMessage.channel.send("You don't have enough balance to give Gold!");
	}
}

module.exports = {
	execute: execute,
	giveGoldByReaction,
};
