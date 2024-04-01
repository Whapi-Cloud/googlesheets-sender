<<<<<<< HEAD
const config = require("./config");
const ExpressServer = require("./core/expressServer").ExpressServer;
const Mailer = require("./core/mailer").Mailer;
const ChannelApi = require("./core/channel").ChannelApi;
const checkFiles = require("./core/files").checkFiles;

async function init() {
  try {
    // check config.js
    checkFiles();
    if(config.port === "") throw "Please set port in config.js"
    if(config.spreadSheetUrl === "") throw "Please set spreadSheetUrl in config.js"
    if(config.spreadSheetUrl.match("/d/(.*?)/edit")[1] === "") throw "Incorrect spreadsheet url"
    if(config.token === "") throw "Please set channel token in config.js"
    if(config.webhookUrl === "") throw "Pleaset set webhook url (from ngrok, for example) in config.js"

    const mailer = new Mailer(config.spreadSheetUrl);
    const isAccess = await mailer.checkPermission(); // check access to google table
    if (!isAccess) return;
    const channel = new ChannelApi(config.token);
    await channel.checkHealth(); // check channel on auth
    const isHooked = await channel.setWebHook(); // set webhook
    if (!isHooked) {
      throw "Hook don't set";
    }
    const sendingList = await mailer.getSendingList();
    await mailer.sendMessages(channel, sendingList);
    const expressServer = new ExpressServer(config.port);
    expressServer.launch();
    return sendingList;
  } catch (e) {
    console.log(e);
  }
}
init().then((list) => console.log(list)); // Output list for mailing
=======
const config = require("./config");
const ExpressServer = require("./core/expressServer").ExpressServer;
const Mailer = require("./core/mailer").Mailer;
const ChannelApi = require("./core/channel").ChannelApi;
const checkFiles = require("./core/files").checkFiles;

async function init() {
  try {
    // check config.js
    checkFiles();
    if(config.port === "") throw "Please set port in config.js"
    if(config.spreadSheetUrl === "") throw "Please set spreadSheetUrl in config.js"
    if(config.spreadSheetUrl.match("/d/(.*?)/edit")[1] === "") throw "Incorrect spreadsheet url"
    if(config.token === "") throw "Please set channel token in config.js"
    if(config.webhookUrl === "") throw "Pleaset set webhook url (from ngrok, for example) in config.js"

    const mailer = new Mailer(config.spreadSheetUrl);
    const isAccess = await mailer.checkPermission(); // check access to google table
    if (!isAccess) return;
    const channel = new ChannelApi(config.token);
    await channel.checkHealth(); // check channel on auth
    const isHooked = await channel.setWebHook(); // set webhook
    if (!isHooked) {
      throw "Hook don't set";
    }
    const sendingList = await mailer.getSendingList();
    await mailer.sendMessages(channel, sendingList);
    const expressServer = new ExpressServer(config.port);
    expressServer.launch();
    return sendingList;
  } catch (e) {
    console.log(e);
  }
}
init().then((list) => console.log(list)); // Output list for mailing
>>>>>>> 8465c35f64ac03ec6455dbe8b0b23c2c4cacd02c
