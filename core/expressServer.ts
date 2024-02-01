import express from "express";
import cors from "cors";
import http from "http";
import { Express } from "express-serve-static-core";
import * as fs from "fs";
import { DBFiles } from "./files";
import { Mailer } from "./mailer";
import config from "../config";
import { RecieverWithStatus } from "../types/index";

const allowedOrigins = ["http://panel.whapi.cloud", "https://localhost"]; // allowed urls for get requests

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The domain is not allowed by CORS policy";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

export class ExpressServer {
  private readonly port: number;
  private readonly app: Express;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.setupMiddleware();
  }

  setupMiddleware() {
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    this.app.post("/hook", async (req, res) => { // hook endpoint
      const isMe = req.body.messages[0].from_me;
      const type = req.body.messages[0].type;
      if(type !== "text" || isMe){
        res.send("OK");
        return;
      }
      const senderPhone = req.body.messages[0].chat_id.replace("@s.whatsapp.net", ""); // get sender phone
      const senderText = req.body.messages[0].text.body; // get message text
      const mailingsRaw = fs.readFileSync(
        DBFiles.mailing_statuses_file,
        "utf-8"
      );
      const mailings: RecieverWithStatus[] = JSON.parse(mailingsRaw);
      const reciever = mailings.find(
        (elem) => elem.to === senderPhone && elem.status === "Delivered"
      ); // looking for the sender in the mailing list
      if (!reciever) { // if not found - skip
        res.send("OK");
        return;
      }
      const mailer = new Mailer(config.spreadSheetUrl);
      const isAccess = await mailer.checkPermission(); // check access to google table
      if (!isAccess) throw 403;
      await mailer.setRecievedMessage(reciever, senderText); // set recieved message to google table
      res.status(200).send("OK");
    });
  }

  launch() {
    this.app.use((req, res, next) => {
      res.setHeader("X-Powered-By", "Google Sheets Sender Script v1.0.0");
      const ip = req.headers["x-forwarded-for"] || req["remoteAddress"];
      next();
    });

    http.createServer(this.app).listen(this.port); // start server
    console.log(`Listening on port ${this.port}`);
  }
}
