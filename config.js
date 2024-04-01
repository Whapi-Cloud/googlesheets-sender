
const config = {
    "numberColumn": "A",
    "recievedMessageColumn": "D",
    "messageColumn": "B",
    "statusColumn": "C",
    "token": "", // channel token
    "webhookUrl": "", // Webhook Link to your server. At ( {server link} ), when POST is requested, processing occurs
    "sendDelay": 20000, // delay between mailings (1 sec = 1000)
    "port": "8080", // server port
    "spreadSheetUrl": "" // url format: https://docs.google.com/spreadsheets/d/.../edit
}

module.exports = config;