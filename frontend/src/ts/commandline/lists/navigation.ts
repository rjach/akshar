import { navigate } from "../../router/navigate";
import { toggleFullscreen } from "../../utils/misc";
import { Command } from "../types";

const commands: Command[] = [
  {
    id: "viewTypingPage",
    display: "View Typing Page",
    alias: "navigate go to start begin type test",
    fa: { icon: "fa-keyboard" },
    exec: (): void => {
      void navigate({ to: "/" });
    },
  },
  {
    id: "viewAbout",
    display: "View About Page",
    alias: "navigate go to",
    fa: { icon: "fa-info" },
    exec: (): void => {
      void navigate({ to: "/about" });
    },
  },
  {
    id: "viewSettings",
    display: "View Settings Page",
    alias: "navigate go to",
    fa: { icon: "fa-cog" },
    exec: (): void => {
      void navigate({ to: "/settings" });
    },
  },
  {
    id: "viewStats",
    display: "View Stats Page",
    alias: "navigate go to stats history results personal best account",
    fa: { icon: "fa-chart-line" },
    exec: (): void => {
      void navigate({ to: "/stats" });
    },
  },
  {
    id: "toggleFullscreen",
    display: "Toggle Fullscreen",
    fa: { icon: "fa-expand" },
    exec: (): void => {
      toggleFullscreen();
    },
  },
];

export default commands;
