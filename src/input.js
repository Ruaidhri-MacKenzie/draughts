import { action, resetSelectedPosition, isContinuingAttack } from "./draughts.js";
import { draw, getPositionFromClick } from "./render.js";

export const onLeftClick = (canvas, state) => (event) => {
	const position = getPositionFromClick(event);
	action(state, position);
	draw(canvas, state);
};

export const onRightClick = (canvas, state) => (event) => {
	event.preventDefault();
	// Deselect tile, cannot deselect when continuing attack
	if (!isContinuingAttack(state)) resetSelectedPosition(state);
	draw(canvas, state);
};
