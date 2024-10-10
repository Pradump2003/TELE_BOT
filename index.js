const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const axios = require("axios");
const { headers } = require("next/headers");
dotenv.config();

// TOKEN fetched using @BotFather to create a new bot
const TOKEN = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", (msg) => {
  const text = msg.text;
  console.log("Message received: ", text);

  bot.sendMessage(msg.chat.id, "You said: " + text);
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Hello! I am a bot. How can I help you?");
});

bot.onText(/\/joke/, async (msg) => {
  const joke = await axios.get(
    "https://official-joke-api.appspot.com/random_joke"
  );

  const setup = joke.data.setup;
  const punchline = joke.data.punchline;

  bot.sendMessage(msg.chat.id, setup + " " + punchline);
});

bot.onText(/\/quotes/, async (msg) => {
  try {
    const quotes = await axios.get(
      "https://api.api-ninjas.com/v1/quotes?category=happiness",
      {
        headers: {
          "X-Api-Key": "yiUOpUPsst85165EPYP8XQ==dgPecI2JSdfk1QY9"
        }
      }
    );    
    const message = quotes?.data[0]?.quote || "";  
    const author = quotes?.data[0]?.author || "";  
    bot.sendMessage(msg.chat.id, message + "\n Author Name: " + author);
  } catch (error) {
    console.error("Error fetching quote:", error);
    bot.sendMessage(msg.chat.id,"Sorry, an error occurred while fetching a quote.");
  }
});
