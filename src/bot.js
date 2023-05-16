// No Motive Discord Bot

// Dependencies
const { Client, GatewayIntentBits } = require("discord.js");
const { discordToken, chatChannelId } = require("./config/config");
const commandHandler = require("./handlers/commandHandler");
const goldCommand = require("./commands/gold");
const { updateReputation } = require("./handlers/reputation");

// Initializing the Discord client and defining the intents
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
	],
});

// Logging in to Discord
client.login(discordToken);

// Ready event
client.on("ready", () => {
	console.log(`${client.user.tag} is ready! 🤖`);
});

// Handle reactions
client.on("messageReactionAdd", async (reaction, user) => {
	if (user.bot) return;

	const goldEmojiId = "1105966765466468525";
	const goldEmoji = client.emojis.cache.get(goldEmojiId);
	const upvoteEmojiId = "1107890878133043200";
	const downvoteEmojiId = "1107890932092764220";

	// Checking if the reaction is the custom gold emoji
	if (reaction.emoji.id === goldEmojiId) {
		const targetMessage = reaction.message;

		// Give gold to the user who reacted to the message
		await goldCommand.giveGoldByReaction(targetMessage, user);

		// Add the custom gold emoji reaction to the target message
		await targetMessage.react(goldEmoji);
	}

	// Check if reaction is upvote or downvote emoji
	if (
		reaction.emoji.id === upvoteEmojiId ||
		reaction.emoji.id === downvoteEmojiId
	) {
		const targetMessage = reaction.message;

		const deltaRep = reaction.emoji.id === upvoteEmojiId ? 1 : -1; // +1 for upvotes, -1 for downvotes

		try {
			const newRepValue = await updateReputation(
				targetMessage.author.id,
				deltaRep
			);

			// Add custom emoji reactions to target message
			const customUpVoteReaction = client.emojis.cache.get(upvoteEmojiId);
			const customDownVoteReaction = client.emojis.cache.get(downvoteEmojiId);

			await targetMessage.react(customUpVoteReaction);
			await targetMessage.react(customDownVoteReaction);
		} catch (error) {
			console.error("Error occurred while updating user's reputation:", error);
		}
	}
});

// Handle messages
client.on("messageCreate", async (message) => {
	if (message.author.bot) return;
	if (message.channel.id !== chatChannelId) return;

	// Handling commands using the command handler
	await commandHandler(message, client);
});

// Error handling
client.on("error", (error) => {
	console.error("An error occurred in the Discord bot: ", error);
});
