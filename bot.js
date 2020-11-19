const {Telegraf} = require('telegraf');
const fs = require('fs');

const greetings = fs.readFileSync('./greetings.txt', 'utf-8').split('\n');

const token = process.env.BotToken;
const bot = new Telegraf(token);

const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const messageGenerator = (username) => {
    return greetings[getRandom(0, greetings.length)]
        .replace('%username%', username);
}

const createMention = (first_name, userId) => {
    return `<a href="tg://user?id=${userId}">${first_name}</a>`;
}

bot.startPolling();
console.log(`${bot.token} started`);
bot.on('new_chat_members', (ctx) => {
    console.log(ctx.message.new_chat_members)
    ctx.message.new_chat_members.forEach(user => {
        const mention = `[${user.first_name}](tg://user?id=${user.id})`;
        ctx.telegram.sendMessage(ctx.chat.id, messageGenerator(createMention(user.first_name, user.id)), {parse_mode: 'html'});
    })
});