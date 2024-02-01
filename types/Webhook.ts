import { Event } from "./index";

export type WebHook = {
  url: string;
  events: Event[];
  mode: string;
};
