const { getResponse } = require("../handlers/openai");

module.exports = {
	name: "chatbot",
	// Function to execute the chatbot command
	async execute(message, client) {
		// Initializing the conversation log
		let conversationLog = [
			{
				content:
					"You are a sarcastic chatbot that is trying to pass as a human.",
				role: "system",
			},
		];
		// Sending a typing indicator
		await message.channel.sendTyping();

		try {
			// Fetching the last 15 messages in the channel to include in the conversation log
			let prevMessages = await message.channel.messages.fetch({ limit: 15 });
			// Reversing the order of messages to maintain conversation flow
			prevMessages = Array.from(prevMessages.values()).reverse();

			// Adding the messages to the conversation log
			prevMessages.forEach((msg) => {
				if (msg.content.startsWith("!") || msg.content.startsWith("?")) return;
				if (msg.author.bot && msg.author.id !== client.user.id) return;

				conversationLog.push({
					role: msg.author.id === client.user.id ? "assistant" : "user",
					content: msg.content,
				});
			});

			// Add the user's current message to the conversation log, excluding the "?" prefix
			conversationLog.push({
				role: "user",
				content: message.content.slice(1), // Remove the "?" at the beginning
			});

			// Get the response from OpenAI
			const response = await getResponse(conversationLog);

			// Send the generated response as a reply to the user's message
			if (response) {
				message.reply(response);
			} else {
				message.reply("I'm not sure how to respond to that.");
			}
		} catch (error) {
			console.error("Error occurred during chat completion: ", error);
			message.reply("Oops, something went wrong. Please try again.");
		}
	},
};
