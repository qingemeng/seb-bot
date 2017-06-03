"use strict";

const Telegraf = require('telegraf')
const TelegrafFlow = require('telegraf-flow')

process.env.BOT_TOKEN = '394673162:AAG8cSJKrz9s93u6jDH-_l4R9O28ON-16i0'
const {Extra} = Telegraf

const {WizardScene} = TelegrafFlow
const flow = new TelegrafFlow()

flow.command('report_new_group', (ctx) => ctx.flow.enter('addGroup'))

const addGroupScene = new WizardScene('addGroup',
    (ctx) => {
        ctx.reply("What's the group name?")
        ctx.flow.wizard.next()
    },
    (ctx) => {
        ctx.reply("What's the group link?")
        ctx.flow.wizard.next()
    },
    (ctx) => {
        ctx.reply('Done')
        ctx.flow.leave()
    }
)

flow.register(addGroupScene)

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(Telegraf.memorySession())
bot.on('text', flow.middleware())

bot.command('start', ({from, reply}) => {
    console.log('start', from)
    return reply('Welcome!')
})

const sayYoMiddleware = ({reply}, next) => reply('yo').then(next)
bot.command('voila', sayYoMiddleware, (context) => {
    console.log(context.message)
    return context.reply('[coffee group](https://t.me/joinchat/AAAAAA3gb6WaatzHJzYFEw)', Extra.markdown())
})

bot.startPolling()