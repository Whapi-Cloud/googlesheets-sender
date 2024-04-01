<<<<<<< HEAD
import * as fs from "fs"

export enum DBFiles {
    "mailing_statuses_file" = "mailing_statuses.json"
  }

  export function checkFiles() { // checking for files
    if(!fs.existsSync("keys.json")) throw "keys.json not found"
    if(!fs.existsSync("config.js")) throw "config.js not found"
    const keys = Object.keys(DBFiles);
  
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const path = DBFiles[key];
      fs.writeFile(path, "[]", function (err) {
        if (err) throw err;
        console.log(`${key} is created succesfully.`);
      });
    }
=======
import * as fs from "fs"

export enum DBFiles {
    "mailing_statuses_file" = "mailing_statuses.json"
  }

  export function checkFiles() { // checking for files
    if(!fs.existsSync("keys.json")) throw "keys.json not found"
    if(!fs.existsSync("config.js")) throw "config.js not found"
    const keys = Object.keys(DBFiles);
  
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const path = DBFiles[key];
      fs.writeFile(path, "[]", function (err) {
        if (err) throw err;
        console.log(`${key} is created succesfully.`);
      });
    }
>>>>>>> 8465c35f64ac03ec6455dbe8b0b23c2c4cacd02c
  }