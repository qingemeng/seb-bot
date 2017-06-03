const Telegraf = require('telegraf')

process.env.BOT_TOKEN = '394673162:AAG8cSJKrz9s93u6jDH-_l4R9O28ON-16i0'
const { Extra, memorySession, reply } = Telegraf

const sayYoMiddleware = ({ reply }, next) => reply('yo').then(next)

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.command('report', sayYoMiddleware, (ctx) => {
    console.log(ctx.message)
return ctx.reply('[coffee group](https://t.me/joinchat/AAAAAA3gb6WaatzHJzYFEw)', Extra.markdown())
})

bot.startPolling()