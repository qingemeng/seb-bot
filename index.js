"use strict";

const Telegraf = require('telegraf')
const TelegrafFlow = require('telegraf-flow')
const db = require('./db').init()

process.env.BOT_TOKEN = '394673162:AAG8cSJKrz9s93u6jDH-_l4R9O28ON-16i0'
const {Extra} = Telegraf

const {WizardScene} = TelegrafFlow
const flow = new TelegrafFlow()

flow.command('report_new_group', context => context.flow.enter('addGroup'))

let name, link
const addGroupScene = new WizardScene('addGroup',
    context => {
        context.reply("What's the group name?")
        context.flow.wizard.next()
    },
    context => {
        name = context.message.text
        context.reply("What's the group link?")
        context.flow.wizard.next()
    },
    context => {
        link = context.message.text
        context.reply(`Done, inserting ${name}, ${link}`)
        const stmt = db.prepare("INSERT INTO groups VALUES (?, ?)");
        stmt.run(name, link);
        stmt.finalize();
        context.flow.leave()
    })

flow.register(addGroupScene)

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(Telegraf.memorySession())
bot.on('text', flow.middleware())

bot.command('start', ({from, reply}) => {
    console.log('start', from)
    return reply('Welcome!')
})

bot.command('voila', (context) => {
    db.all('SELECT * FROM groups', function (err, rows) {
        if (err) {
            console.error(err)
            return
        }

        const groups = rows.map(row => `- [${row.name}](${row.link})`)
        return context.reply(groups.join('\n'), Extra.markdown())
    })
})

console.log('Starting the bot…')
bot.startPolling()