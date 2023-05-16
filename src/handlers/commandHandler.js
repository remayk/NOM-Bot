const mineCommand = require("../commands/mine");
const chatbotCommand = require("../commands/chatbot");
const balanceCommand = require("../commands/balance");
const goldCommand = require("../commands/gold");
const boostCommand = require("../commands/boost");
const baltopCommand = require("../commands/baltop");
const repCommand = require("../commands/rep");

// A mapping of command names to their respective modules
const commands = {
	"..mine": mineCommand,
	"?": chatbotCommand,
	"..bal": balanceCommand,
	"..gold": goldCommand,
	"..boost": boostCommand,
	"..baltop": baltopCommand,
	"..rep": repCommand,
};

/**
 * Handles the execution of commands based on the message content.
 * @param {Message} message - The Discord message object.
 * @param {Client} client - The Discord client object.
 */
async function handleCommand(message, client) {
	// Finding the command that matches the message content
	const command = Object.keys(commands).find(
		(cmd) => message.content.trim() === cmd
	);

	// If a command is found, execute it
	if (command) {
		await commands[command].execute(message, client);
	}
}

module.exports = handleCommand;
