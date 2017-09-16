'use strict';

import Telegraf from 'telegraf';
import TelegrafFlow from 'telegraf-flow';

const db = require('./db');

const {Extra} = Telegraf;

const {WizardScene} = TelegrafFlow;
const flow = new TelegrafFlow();

flow.command('add_group', context => context.flow.enter('addGroup'));

let name, link;
const addGroupScene = new WizardScene('addGroup',
    context => {
        db.doorCheck(context)
            .then((passed) => {
                if (!passed) {
                    return context.reply('you haven\'t key in the magic words');
                }
                context.reply('What\'s the group name?');
                context.flow.wizard.next();
            });
    },
    context => {
        name = context.message.text;
        context.reply('What\'s the group invitation link (you have to be the creator)?');
        context.flow.wizard.next();
    },
    context => {
        link = context.message.text;
        context.reply(`Done, adding ${name}, ${link}`);
        db.write('groups/', name, link);
        context.flow.leave();
    });

flow.register(addGroupScene);

flow.command('start', context => {
    context.flow.enter('authenticate');
    console.log('start...');
});
const authenticateScene = new WizardScene('authenticate',
    context => {
        context.reply('What\'s the magic words?');
        context.flow.wizard.next();
    },
    context => {
        db.auth(context)
            .then((passed) => {
                return context.reply(passed ? 'Welcome' : 'Wrong password');
            });
        console.log(Telegraf.memorySession());
        context.flow.leave();
    });

flow.register(authenticateScene);

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(Telegraf.memorySession());
bot.on('text', flow.middleware());

bot.command('list_groups', (context) => {
    db.doorCheck(context)
        .then((passed) => {
            if (!passed) {
                return context.reply('you haven\'t key in the magic words');
            }

            db.read('groups/').then(function (groupsMapping) {
                const groups = Object.entries(groupsMapping).map(([name, link]) => `- [${name}](${link})`);
                return context.reply(groups.join('\n'), Extra.markdown());
            });
        });
});

console.log('Starting the bot…');
bot.startPolling();
