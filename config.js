<<<<<<< HEAD
const config = {
    "numberColumn": "A",
    "recievedMessageColumn": "C",
    "messageColumn": "B",
    "token": "C",
    "webhookUrl": "",
    "sendDelay": 20000, // delay between mailings (1 sec = 1000)
    "port": "8080", // server port
    "spreadSheetUrl": "" // url format: https://docs.google.com/spreadsheets/d/.../edit
}

module.exports = config;
=======
const config = {
    "numberColumn": "A",
    "recievedMessageColumn": "C",
    "messageColumn": "B",
    "token": "", // channel token
    "webhookUrl": "", // Webhook Link to your server. At ( {server link} ), when POST is requested, processing occurs
    "sendDelay": 20000, // delay between mailings (1 sec = 1000)
    "port": "8080", // server port
    "spreadSheetUrl": "" // url format: https://docs.google.com/spreadsheets/d/.../edit
}

module.exports = config;
>>>>>>> 8465c35f64ac03ec6455dbe8b0b23c2c4cacd02c
