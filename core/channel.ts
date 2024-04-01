<<<<<<< HEAD
import * as config from "../config.js";
import { WebHook } from "../types";

export class ChannelApi {
  readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  async checkHealth() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${this.token}`,
      },
    };

    const responseRaw = await fetch("https://gate.whapi.cloud/health", options);
    const response = await responseRaw.json();
    if (response.status.text !== "AUTH") throw "Channel not auth";
  }

  async sendMessage(to: string, body: string): Promise<boolean> {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ typing_time: 0, to, body }),
    };

    const responseRaw = await fetch(
      "https://gate.whapi.cloud/messages/text",
      options
    );
    const response = await responseRaw.json();
    return response.sent;
  }

  async checkPhone(phone: string): Promise<boolean> {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        blocking: "wait",
        force_check: true,
        contacts: [phone],
      }),
    };

    const responseRaw = await fetch(
      "https://gate.whapi.cloud/contacts",
      options
    );
    const response = await responseRaw.json();
    if (response.contacts[0].status !== "valid") {
      return false;
    }
    return true;
  }

  async setWebHook(): Promise<boolean> {
    const currentHooks = await this.getWebHooks();
    if (currentHooks.find((elem) => elem.url === config.webhookUrl)) return true;
    const index = currentHooks.findIndex((elem) => elem.url.includes("ngrok"));
    if (index !== -1) currentHooks[index].url = config.webhookUrl;
    else
      currentHooks.push({
        events: [{ type: "messages", method: "post" }],
        mode: "body",
        url: config.webhookUrl + "/hook",
      });
    const options = {
      method: "PATCH",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({webhooks: currentHooks}),
    };

    const responseRaw = await fetch(
      "https://gate.whapi.cloud/settings",
      options
    );
    if (responseRaw.status !== 200) return false;
    return true;
  }

  async getWebHooks(): Promise<WebHook[]> {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${this.token}`,
      },
    };

    const responseRaw = await fetch(
      "https://gate.whapi.cloud/settings",
      options
    );
    const response = await responseRaw.json();
    return response.webhooks;
  }
}
=======
import * as config from "../config.js";
import { WebHook } from "../types";

export class ChannelApi {
  readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  async checkHealth() {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${this.token}`,
      },
    };

    const responseRaw = await fetch("https://gate.whapi.cloud/health", options);
    const response = await responseRaw.json();
    if (response.status.text !== "AUTH") throw "Channel not auth";
  }

  async sendMessage(to: string, body: string): Promise<boolean> {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ typing_time: 0, to, body }),
    };

    const responseRaw = await fetch(
      "https://gate.whapi.cloud/messages/text",
      options
    );
    const response = await responseRaw.json();
    return response.sent;
  }

  async checkPhone(phone: string): Promise<boolean> {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        blocking: "wait",
        force_check: true,
        contacts: [phone],
      }),
    };

    const responseRaw = await fetch(
      "https://gate.whapi.cloud/contacts",
      options
    );
    const response = await responseRaw.json();
    if (response.contacts[0].status !== "valid") {
      return false;
    }
    return true;
  }

  async setWebHook(): Promise<boolean> {
    const currentHooks = await this.getWebHooks();
    if (currentHooks.find((elem) => elem.url === config.webhookUrl)) return true;
    const index = currentHooks.findIndex((elem) => elem.url.includes("ngrok"));
    if (index !== -1) currentHooks[index].url = config.webhookUrl;
    else
      currentHooks.push({
        events: [{ type: "messages", method: "post" }],
        mode: "body",
        url: config.webhookUrl + "/hook",
      });
    const options = {
      method: "PATCH",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({webhooks: currentHooks}),
    };

    const responseRaw = await fetch(
      "https://gate.whapi.cloud/settings",
      options
    );
    if (responseRaw.status !== 200) return false;
    return true;
  }

  async getWebHooks(): Promise<WebHook[]> {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${this.token}`,
      },
    };

    const responseRaw = await fetch(
      "https://gate.whapi.cloud/settings",
      options
    );
    const response = await responseRaw.json();
    return response.webhooks;
  }
}
>>>>>>> 8465c35f64ac03ec6455dbe8b0b23c2c4cacd02c
