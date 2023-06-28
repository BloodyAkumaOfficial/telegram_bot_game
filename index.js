const TelegramApi = require('node-telegram-bot-api');
const {gameOption, againOption} = require('./options/options');

const token = '5871426305:AAFAxCyNZcFK_8Ul7TlbRazUCbCSetoYhXs';

const bot = new TelegramApi(token, {polling: true});

const chats = [];

const startGame = async (chatId) => {
    await bot.sendMessage(chatId,
        `Lets play a game!
I will guess a number from 1 to 10
and you will have to guess`);
    chats[chatId] = Math.floor(Math.random() * 10) + 1;
    await bot.sendMessage(chatId, 'Lets start guessing', gameOption)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Get started'},
        {command: '/info', description: 'Get info about user'},
        {command: '/game', description: 'Start a game'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id
        if (text === '/start') {
            await bot.sendMessage(chatId, 'Welcome!');
            return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/39.jpg')
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Hello, your name is ${msg.from.first_name}, nice to meet you)`);
        }

        if (text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'I dont understand your message!(');
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') return startGame(chatId);
        if (Number(data) === chats[chatId]) {
            return await bot.sendMessage(chatId, `You guessed) 
The hidden number is ${chats[chatId]}`, againOption)
        } else {
            return await bot.sendMessage(chatId, `You loose( 
The hidden number is ${chats[chatId]}`, againOption)
        };
    });

    console.log('bots server started');
}

start();