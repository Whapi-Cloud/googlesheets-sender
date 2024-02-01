import { getGSAPI, ValueRange, Sheets } from "./gsapi";
import * as config from "../config";
import { Reciever, RecieverWithStatus } from "../types/index";
import * as fs from "fs";
import { ChannelApi } from "./channel";
import { DBFiles } from "../core/files";

export class Mailer {
  private api: Sheets;
  readonly spreadsheetId: string;
  private sheetName: string;

  constructor(spreadSheetUrl: string) {
    this.spreadsheetId = spreadSheetUrl.match("/d/(.*?)/edit")[1];
    this.api = getGSAPI();
  }

  async sendMessages(channel: ChannelApi, list: Reciever[]) { // send messages
    if (!list || list.length === 0) throw 422;

    for (let i = 0; i < list.length; i++) {
      setTimeout(async () => {
        const reciever = list[i];
        try {
          const phoneExist = await channel.checkPhone(reciever.to);
          if (!phoneExist) {
            this.saveStatus(
              reciever,
              "Phone not found in WhatsApp",
              DBFiles.mailing_statuses_file
            );
            return;
          }
          const isSending = await channel.sendMessage(
            reciever.to,
            reciever.body
          );
          if (isSending)
            this.saveStatus(
              reciever,
              "Delivered",
              DBFiles.mailing_statuses_file
            );
          else
            this.saveStatus(
              reciever,
              "Not delivered",
              DBFiles.mailing_statuses_file
            );
        } catch (e) {
          console.log("e", e);
          this.saveStatus(
            reciever,
            "Error in sending",
            DBFiles.mailing_statuses_file
          );
        }
      }, (i + 1) * config.sendDelay);
    }
  }

  async getSendingList(): Promise<Reciever[]> { // get data from google sheet
    try {
      const options = {
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!${config.numberColumn}:${config.messageColumn}`,
      };
      const { data: rawData }: { data: ValueRange } =
        await this.api.spreadsheets.values.get(options);
      return this.transformRows(rawData.values);
    } catch (e) {
      throw e.code || e;
    }
  }

  async getSheetName(): Promise<string> { // get first sheet name
    const options = { spreadsheetId: this.spreadsheetId };
    const sheet = await this.api.spreadsheets.get(options);
    return sheet.data.sheets[0].properties.title;
  }

  async checkPermission(): Promise<boolean> {
    try {
      this.sheetName = await this.getSheetName();
      await this.api.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${this.sheetName}!J1:J1`,
        requestBody: { values: [[""]] },
        valueInputOption: "RAW",
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async setRecievedMessage(reciever: RecieverWithStatus, message: string) { // set message to Google table
    await this.api.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${this.sheetName}!${config.recievedMessageColumn}${reciever.row}:${config.recievedMessageColumn}${reciever.row}`,
      requestBody: { values: [[message]] },
      valueInputOption: "RAW",
    });
    this.saveStatus(reciever, "Response recieved", DBFiles.mailing_statuses_file)
  }

  transformRows(rawRows: any[]): Reciever[] {
    if (!rawRows || rawRows.length === 0) throw "Table is empty";
    const result: Reciever[] = [];
    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      const reciever: Reciever = {
        to: row[0] || "",
        body: row[1] || "",
        row: i + 1,
      };
      if (reciever?.body === "" && reciever?.to === "") {
        this.saveStatus(
          reciever,
          "This row is empty",
          DBFiles.mailing_statuses_file
        );
        continue;
      } // if message and phone are empty - skip and set status
      if (reciever?.body === "") {
        this.saveStatus(
          reciever,
          "Message is empty",
          DBFiles.mailing_statuses_file
        );
        continue;
      } // if only message empty - skip and set status
      if (reciever?.to === "") {
        this.saveStatus(reciever, "Phone is empty", DBFiles.mailing_statuses_file);
        continue;
      } // if only number empty - skip and set status
      reciever.to = this.extractDigitsFromPhoneNumber(reciever.to);
      if (reciever?.to === "") {
        this.saveStatus(
          reciever,
          `Check the data in cell ${config.numberColumn}${i + 1}`,
          DBFiles.mailing_statuses_file
        );
        continue;
      } // if number is empty after formatting - skip and set status
      this.saveStatus(reciever, "In processing", DBFiles.mailing_statuses_file)
      result.push(reciever); // if all good - add to result
    }
    return result;
  }

  saveStatus(reciever: Reciever, status: string, file: DBFiles) { // save status of mailing to file
    const { body, row, to } = reciever;
    const currentDataRaw = fs.readFileSync(file, "utf-8");
    const currentData: RecieverWithStatus[] = JSON.parse(currentDataRaw);
    const index = currentData.findIndex((elem) => elem.to === to && elem.row === reciever.row);
    if (index === -1) currentData.push({ status, body, row, to });
    else currentData[index].status = status
    const writeData = JSON.stringify(currentData);
    fs.writeFileSync(file, writeData, "utf-8");
  }

  private extractDigitsFromPhoneNumber(phoneNumber: string): string { // get digits from phone string
    const cleanedPhoneNumber = phoneNumber.replace(/[^\d+\s]/g, "");
    return cleanedPhoneNumber.replace(/\s/g, "").replace(/^\+/, "");
  }
}
