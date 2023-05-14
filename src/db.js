const mongoose = require("mongoose");
const { dbToken } = require("./config/config");

// Connecting to MongoDB using Mongoose
mongoose.connect(dbToken, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Handling the connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = mongoose;
