import { createState } from "./draughts.js";
import { initImages, resizeCanvas, draw } from "./render.js";
import { onLeftClick, onRightClick } from "./input.js";

const canvas = document.getElementById("game-window");
const state = createState();

await initImages();
resizeCanvas(canvas, state);
draw(canvas, state);
canvas.addEventListener("click", onLeftClick(canvas, state));
canvas.addEventListener("contextmenu", onRightClick(canvas, state));
