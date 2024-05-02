import { setSelectedPosition, resetSelectedPosition, hasSelectedPosition, toggleSelectedPosition, nextTurn } from "./play.js";
import { isValidPosition, isSelfTile, tileIsSelectable, isContinuingAttack, resetContinuingAttack } from "./draughts.js";
import { isValidMove, isValidAttack, actionMove, actionAttack } from "./actions.js";
import { draw, getPositionFromClick } from "./render.js";

export const onLeftClick = (canvas, state) => (event) => {
	// Get column and row positions from click
	const position = getPositionFromClick(event);

	// Check if the position is playable (black chequer)
	if (!isValidPosition(position)) return;

	// If continuing attack, must take available attack
	if (isContinuingAttack(state)) {
		if (isValidAttack(state, state.selectedPosition, position)) {
			resetContinuingAttack(state);
			actionAttack(state, state.selectedPosition, position);
			if (isContinuingAttack(state)) {
				setSelectedPosition(state, { ...state.continuingAttack });
			}
			else {
				resetSelectedPosition(state);
				nextTurn(state);
			}
			draw(canvas, state);
		}
		return;
	}

	// If clicked own tile then select and return, only select tiles with valid actions
	if (isSelfTile(state, position)) {
		if (tileIsSelectable(state, position)) {
			toggleSelectedPosition(state, position);
			draw(canvas, state);
		}
		return;
	}

	// If no tile selected then return
	if (!hasSelectedPosition(state)) return;

	// Check if clicked position is a valid move/attack for the selected tile
	if (isValidMove(state, state.selectedPosition, position)) {
		actionMove(state, state.selectedPosition, position);
		resetSelectedPosition(state);
		nextTurn(state);
	}
	else if (isValidAttack(state, state.selectedPosition, position)) {
		actionAttack(state, state.selectedPosition, position);
		if (isContinuingAttack(state)) {
			setSelectedPosition(state, { ...state.continuingAttack });
		}
		else {
			resetSelectedPosition(state);
			nextTurn(state);
		}
	}

	draw(canvas, state);
};

export const onRightClick = (canvas, state) => (event) => {
	event.preventDefault();
	// Deselect tile, cannot deselect when continuing attack
	if (!isContinuingAttack(state)) resetSelectedPosition(state);
	draw(canvas, state);
};
