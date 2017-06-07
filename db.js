"use strict";

const firebase = require('firebase');

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "seb-bot.firebaseapp.com",
    databaseURL: "https://seb-bot.firebaseio.com",
    projectId: "seb-bot",
    storageBucket: "seb-bot.appspot.com",
    messagingSenderId: "772903708437"
};

firebase.initializeApp(config);
const db = firebase.database();

const read = (path) => db.ref(`/${path}`).once('value').then(snapshot => snapshot.val())

const write = (path, key, value) => {
    db.ref(`/${path}${key}`).set(value);
}

const auth = (context) => {
    return firebase.auth().signInAnonymously()
        .then(() => read('password/')
            .then((password) => {
                    const passed = password === context.message.text
                    if (passed) {
                        write('chats/', context.message.chat.id, context.message.chat.username)
                    }
                    return passed
                }
            )
        )
}

const doorCheck = (context) => {
    return firebase.auth().signInAnonymously()
        .then(() => read('chats/')
            .then((chatsMapping) => {
                console.log(chatsMapping[context.message.chat.id])
                return chatsMapping[context.message.chat.id]
            }))
}

module.exports = {
    read,
    write,
    auth,
    doorCheck
}