const Discord = require("discord.js");
const fs = require("fs"); //Редактор файлов
module.exports.run = async (bot, message, args) => {
    message.channel.send('Ты хочешь поиграть со мной, пупсик? :kissing_heart: \nМожет тогда в ЛС? :wink:');
};
module.exports.help = {
  name: "ping"
};
