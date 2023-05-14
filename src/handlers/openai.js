const { Configuration, OpenAIApi } = require("openai");
const { openaiKey } = require("../config/config");

// Initializing the OpenAI API
const configuration = new Configuration({
	apiKey: openaiKey,
});
const openai = new OpenAIApi(configuration);

/**
 * Get a response from the OpenAI API based on the conversation log.
 * @param {Array<Object>} conversationLog - An array of conversation messages with role and content properties.
 * @returns {Promise<string>} - A promise that resolves to the generated response from the API.
 * @throws Will throw an error if the API call fails
 **/
async function getResponse(conversationLog) {
	try {
		// Call the API
		const result = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: conversationLog,
		});
		// Return the response
		return result.data.choices[0].message.content;
	} catch (error) {
		console.error("Error occurred during chat completion: ", error);
	}
	throw error;
}

module.exports = {
	getResponse,
};
