import { google, sheets_v4 } from "googleapis";

const client = new google.auth.GoogleAuth({
  keyFile: "keys.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export type ValueRange = sheets_v4.Schema$ValueRange;
export type Sheets = sheets_v4.Sheets;

let gsapi: Sheets;

function authorize() {
  gsapi = google.sheets({ version: "v4", auth: client });
  if (!gsapi) {
    console.log("Connect to google sheet failed");
  }
}

authorize();

export function getGSAPI() {
  if (!gsapi) throw 500;
  return gsapi;
}
