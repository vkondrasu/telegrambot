const functions = require('firebase-functions');
const apixu = require('apixu');

let config = require('./env.json');

if(Object.keys(functions.config()).length){
    config = functions.config();
}


const apixuClient = new apixu.Apixu({
    apikey: config.service.apixu_key
})


const Telegraf = require('telegraf')

const bot = new Telegraf(config.service.telegram_key)//process.env.BOT_TOKEN
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍 cool'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.on('text', (ctx) => {
    let query = ctx.update.message.text;
    apixuClient.current(query).then((current) => {
      return ctx.reply(
        `The current weather in ${query} is C: ${current.current.temp_c} F:${current.current.temp_f}`);
    }).catch((err) => {
      return ctx.reply('This city is not exists', err);
    });
  });
bot.launch()

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase 101!");
});

exports.newName = functions.https.onRequest((request, response) => {
    response.send("Tisuko bhayya");
});

exports.getWeather = functions.https.onRequest((request, response) => {
    apixuClient.current('hyderabad').then( (city) =>{
        return response.send('<h1>' + city.current.temp_c + '</h1><h4>' + city.current.last_updated + '</h2>');
    }).catch(err =>{
        response.send(err);
    })
});