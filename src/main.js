import { createState } from "./draughts-state.js";
import { tileSize, initIconImages, createCanvas, resizeCanvas } from "./render.js";
import { initDraughtsImages, draughtsDraw } from "./draughts-render.js";
import { onLeftClick, onRightClick } from "./input.js";
import { draughtsLeftClick, draughtsRightClick } from "./draughts-input.js";

const main = async (canvas, state) => {
	// Load Images
	await initIconImages();
	await initDraughtsImages();
	
	// Init Canvas
	resizeCanvas(canvas, state.board);
	draughtsDraw(canvas, state);
	
	// Set Inputs
	canvas.addEventListener("mousedown", onLeftClick(canvas, tileSize, state, draughtsLeftClick, draughtsDraw));
	canvas.addEventListener("contextmenu", onRightClick(canvas, tileSize, state, draughtsRightClick, draughtsDraw));
};

main(createCanvas(document.getElementById("game-window")), createState());
