const Discord = require("discord.js");
const fs = require("fs"); //Редактор файлов
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
let config = require("./botconfig.json"); //Конфиги
let token = config.token; //Токен из конфига
let prefix = config.prefix; //Префикс бота из конфига
let initialRole = config.role; //Стандартная роль
let profile = require("./profile.json");

//Подключаем файл с функциями
fs.readdir("./cmds/", (err, files) => {
  if (err) console.log(err); //Вывод ошибки, если есть
  let jsfiles = files.filter((f) => f.split(".").pop() === "js"); //Находим файл с окончанием js
  if (jsfiles.length <= 0) console.log("Отсутствуют команды для загрузки!");
  console.log(`Загружено ${jsfiles.length}:`);
  jsfiles.forEach((f, i) => {
    let props = require(`./cmds/${f}`);
    console.log(`    ${i + 1} - ${f} Загружен!`);
    bot.commands.set(props.help.name, props);
  });
});

//Бот готов к работе
bot.on("ready", () => {
  /*bot.generateInvite(["ADMINISTRATOR"]).then((link) => {
    console.log(link);
  });*/
  console.log(`Был запущен ${bot.user.username}!`);
});

//Выдать пермишен новому пользователю
bot.on("guildMemberAdd", (member) => {
  //console.log(`Новый пользователь!`);
  role = member.guild.roles.cache.find((role) => role.name === initialRole);
  member.roles.add(role.id).catch((e) => console.log(e));
});

//В чате появилось сообщения
bot.on("message", async (message) => {
  if (message.author.bot) return; //Автор запроса - бот
  if (message.channel.type == "dm") return; //Написали в ЛС
  let user = message.author.username; //Имя автора сообщения
  let userid = message.author.id; //id автора
  if (!profile[userid]) {
    profile[userid] = {
      name: user,
    };
  }
  fs.writeFile("./profile.json", JSON.stringify(profile), (err) => {
    if (err) console.log(err);
  });
  if (!message.content.startsWith(prefix)) return; //Начинается не с префикса
  let messageArray = message.content.split(" "); //Массив сообщения
  let command = messageArray[0].toLowerCase(); //Сама комманда из 1 слова, потому в 0 элементе
  let args = messageArray.slice(1); //Сами аргументы. Все, кроме 0 эл-та
  let cmd = bot.commands.get(command.slice(prefix.length)); //Получение самой комманды, без префикса
  if (cmd) cmd.run(bot, message, args);
  else message.channel.send("Введи комманду, солнышко :kissing_heart:");
});

bot.login(token);
