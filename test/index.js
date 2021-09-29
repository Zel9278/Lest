const { Lest } = require("../dist/index.js");
const { client } = new Lest({
  sourceDir: "./src",
  prefix: "??",
  log: "true",
  admin: ["519438980744347648"],
  defaultCommand: ["help", "reload", "eval", "ping"],
  clientOptions: {
    partials: ["MESSAGE", "REACTION"],
    intents: 32767 // ALL
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
