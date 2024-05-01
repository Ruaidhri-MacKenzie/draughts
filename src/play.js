import { getTile, rotateBoard } from "./board.js";
import { attackIsAvailable, moveIsAvailable, resetState } from "./draughts.js";

export const isRedTurn = (state) => {
	return state.currentPlayer === 1;
};

export const isBlueTurn = (state) => {
	return state.currentPlayer === -1;
};

export const swapPlayers = (state) => {
	// Switch between Red and Blue players
	state.currentPlayer *= -1;
};

export const setSelectedPosition = (state, position) => {
	const { column, row } = position;		// Destructed to get a copy
	state.selectedPosition = { column, row };
};

export const resetSelectedPosition = (state) => {
	state.selectedPosition = { column: null, row: null };
};

export const isSelectedPosition = (state, position) => {
	return state.selectedPosition.column === position.column && state.selectedPosition.row === position.row;
};

export const hasSelectedPosition = (state) => {
	return !(state.selectedPosition.column == null || state.selectedPosition.row == null);
};

export const toggleSelectedPosition = (state, position) => {
	if (isSelectedPosition(state, position)) resetSelectedPosition(state);
	else setSelectedPosition(state, position);
};

export const calculateScores = (state) => {
	let selfScore = 0;
	let otherScore = 0;
	for (let row = 0; row < state.board.length; row++) {
		for (let column = 0; column < state.board[0].length; column++) {
			const position = { column, row };
			const tile = getTile(state, position);
			if (tile > 0) selfScore += tile;
			else if (tile < 0) otherScore += Math.abs(tile);
		}
	}
	return [selfScore, otherScore];
};

export const gameOver = (state, selfScore, otherScore) => {
	if (selfScore === otherScore) {
		console.log("Game over - Draw!");
	}
	else if ((isRedTurn(state) && selfScore > otherScore) || (isBlueTurn(state) && selfScore < otherScore)) {
		console.log("Game over - Red wins!");
		state.redWins += 1;
	}
	else if ((isBlueTurn(state) && selfScore > otherScore) || (isRedTurn(state) && selfScore < otherScore)) {
		console.log("Game over - Blue wins!");
		state.blueWins += 1;
	}
	resetState(state);
};

export const nextTurn = (state) => {
	const [selfScore, otherScore] = calculateScores(state);

	// Check if player has won
	if (otherScore === 0) {
		gameOver(state, selfScore, otherScore);
		return;
	}

	// Rotate the board and change which team is self
	swapPlayers(state);
	rotateBoard(state);

	if (!moveIsAvailable(state) && !attackIsAvailable(state)) {
		swapPlayers(state);
		rotateBoard(state);
		if (!moveIsAvailable(state) && !attackIsAvailable(state)) {
			// No valid actions available for either player
			gameOver(state, selfScore, otherScore);
		}
	}
};
