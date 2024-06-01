import { createDraughtsBoard, resetDraughtsBoard } from "./draughts-board.js";

// Continuing Attack
export const isContinuingAttack = (state) => {
	return state.continuingAttack.column !== null && state.continuingAttack.row !== null;
};

export const setContinuingAttack = (state, position) => {
	state.continuingAttack = { ...position };
};

export const resetContinuingAttack = (state) => {
	state.continuingAttack = { column: null, row: null };
};

// Game State
export const createState = () => {
	return {
		playerOneWins: 0,
		playerTwoWins: 0,
		currentPlayer: 1,
		selectedPosition: { column: null, row: null },
		board: createDraughtsBoard(),		// Create representation of the game board using a 2d array
		continuingAttack: { column: null, row: null },
	};
};

export const resetState = (state) => {
	state.currentPlayer = 1;
	state.selectedPosition = { column: null, row: null };
	state.continuingAttack = { column: null, row: null };
	state.board = resetDraughtsBoard(state.board);
};

export const updateState = (state, action) => {
	// Action = [startPosition, endPosition]
	
};

export const scoreState = (state) => {
	// Adds all tiles together. Normal tiles are worth 1 each, kings are worth 2.
	// Positive score means current player is winning. Negative score means opponent is winning.
	return state.board.reduce((acc1, cur1) => acc1 + cur1.reduce((acc2, cur2) => acc2 + cur2), 0);
};
