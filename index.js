import TelegramApi from 'node-telegram-bot-api'
import { images } from './images.js'
import { descr } from './descr.js'
import pkg from 'dotenv';

pkg.config()

const bot = new TelegramApi(process.env.BOT_TOKEN, {polling: true})

const startOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Нажьми минэ', callback_data: '/again'}]
        ]
    })
}

const startGame = async (chatId) => {
    const ramdomNumberToImages = Math.floor(Math.random() * 41)
    const ramdomNumberToDescr = Math.floor(Math.random() * 11)

    const againOptions = {
        caption: descr[ramdomNumberToDescr],
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Ищо рас', callback_data: '/again'}]
            ]
        })
    }

    return bot.sendPhoto(chatId, images[ramdomNumberToImages] , againOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Приветствие' },
        { command: '/info', description: 'Информация' },
        // { command: '/game', description: 'Игра' }
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id
        const user = msg.from.first_name
    
        if(text === '/start') {
           await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/l/Lion_life/Lion_life_001.webp')
           return bot.sendMessage(chatId, `Приветь ${user}! Приветь! Ты чиво ета, леф? Дэвэ ти нажмёщь на кнопуку а я тибэ пришлю кису`, startOptions)
        }
    
        if(text === '/info'){
            return bot.sendMessage(chatId, `Ета чатЪ щитобы падняц насраэниэ каторае упало`)
        }
        // if(text === '/game'){
        //     await bot.sendMessage(chatId, `Ти нажми на кнопку а я тибэ пришлю льва`)
        //     return startGame(chatId)
        // }

        return bot.sendMessage(chatId, 'Я тоби нипанимаэ')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if(data === '/again'){
            return startGame(chatId)
        }
    })
}

start();