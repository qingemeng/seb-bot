"use strict";

const Telegraf = require('telegraf')
const TelegrafFlow = require('telegraf-flow')
const db = require('./db')

const {Extra} = Telegraf

const {WizardScene} = TelegrafFlow
const flow = new TelegrafFlow()

flow.command('add_group', context => context.flow.enter('addGroup'))

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
        db.write(name, link)
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

bot.command('list_groups', (context) => {
    db.read().then(function (groupsMapping) {
        const groups = Object.entries(groupsMapping).map(([name, link]) => `- [${name}](${link})`)
        return context.reply(groups.join('\n'), Extra.markdown())
    })
})

console.log('Starting the bot…')
bot.startPolling()