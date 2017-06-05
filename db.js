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

const read = () => db.ref('/groups/').once('value').then(snapshot => snapshot.val())

const write = (name, link) => {
    db.ref(`/groups/${name}`).set(link);
}

module.exports = {
    read,
    write
}