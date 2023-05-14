// Importing the .env file
require("dotenv").config();

// Exporting the config variables
module.exports = {
	// Discord bot token
	discordToken: process.env.DISCORD_TOKEN,
	// Discord channel ID for the chatbot
	chatChannelId: process.env.CHAT_CHANNEL_ID,
	// OpenAI API key for the chatbot
	openaiKey: process.env.OPENAI_KEY,
	// MongoDB connection string
	dbToken: process.env.DB_TOKEN,
};
