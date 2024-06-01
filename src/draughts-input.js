import { isTileSelf, isPositionValid } from "./draughts-board.js";
import { isContinuingAttack, resetContinuingAttack } from "./draughts-state.js";
import { isTileSelectable, isMoveValid, isAttackValid, actionMove, actionAttack } from "./draughts-actions.js";
import { nextTurn } from "./draughts-play.js";

const setSelectedPosition = (state, position) => {
	const { column, row } = position;		// Destructed to get a copy
	state.selectedPosition = { column, row };
};

const resetSelectedPosition = (state) => {
	state.selectedPosition = { column: null, row: null };
};

const isSelectedPosition = (state, position) => {
	return state.selectedPosition.column === position.column && state.selectedPosition.row === position.row;
};

const toggleSelectedPosition = (state, position) => {
	if (isSelectedPosition(state, position)) resetSelectedPosition(state);
	else setSelectedPosition(state, position);
};

export const hasSelectedPosition = (state) => {
	return !(state.selectedPosition.column == null || state.selectedPosition.row == null);
};

export const draughtsLeftClick = (state, position) => {
	// Check if the position is playable (black chequer)
	if (!isPositionValid(position)) return;

	// If continuing attack, must take available attack
	if (isContinuingAttack(state)) {
		if (isAttackValid(state, state.selectedPosition, position)) {
			resetContinuingAttack(state);
			actionAttack(state, state.selectedPosition, position);
			if (isContinuingAttack(state)) {
				setSelectedPosition(state, { ...state.continuingAttack });
			}
			else {
				resetSelectedPosition(state);
				nextTurn(state);
			}
		}
		return;
	}

	// If clicked own tile then select and return, only select tiles with valid actions
	if (isTileSelf(state.board, position)) {
		if (isTileSelectable(state, position)) {
			toggleSelectedPosition(state, position);
		}
		return;
	}

	// If no tile selected then return
	if (!hasSelectedPosition(state)) return;

	// Check if clicked position is a valid move/attack for the selected tile
	if (isMoveValid(state, state.selectedPosition, position)) {
		actionMove(state, state.selectedPosition, position);
		resetSelectedPosition(state);
		nextTurn(state);
	}
	else if (isAttackValid(state, state.selectedPosition, position)) {
		actionAttack(state, state.selectedPosition, position);
		if (isContinuingAttack(state)) {
			setSelectedPosition(state, { ...state.continuingAttack });
		}
		else {
			resetSelectedPosition(state);
			nextTurn(state);
		}
	}

};

export const draughtsRightClick = (state, position) => {
	// Deselect tile, cannot deselect when continuing attack
	if (!isContinuingAttack(state)) resetSelectedPosition(state);
};
