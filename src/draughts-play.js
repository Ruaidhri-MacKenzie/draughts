import { getTile, rotateBoard } from "./board.js";
import { isAttackAvailable, isMoveAvailable } from "./draughts-actions.js";
import { resetState } from "./draughts-state.js";
import { isPlayerOneTurn, isPlayerTwoTurn, swapPlayers } from "./play.js";

export const calculateScores = (state) => {
	let selfScore = 0;
	let otherScore = 0;
	for (let row = 0; row < state.board.length; row++) {
		for (let column = 0; column < state.board[0].length; column++) {
			const position = { column, row };
			const tile = getTile(state.board, position);
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
	else if ((isPlayerOneTurn(state) && selfScore > otherScore) || (isPlayerTwoTurn(state) && selfScore < otherScore)) {
		console.log("Game over - Player One wins!");
		state.playerOneWins += 1;
	}
	else if ((isPlayerTwoTurn(state) && selfScore > otherScore) || (isPlayerOneTurn(state) && selfScore < otherScore)) {
		console.log("Game over - Player Two wins!");
		state.playerTwoWins += 1;
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
	state.board = rotateBoard(state.board);

	if (!isMoveAvailable(state) && !isAttackAvailable(state)) {
		swapPlayers(state);
		state.board = rotateBoard(state.board);
		if (!isMoveAvailable(state) && !isAttackAvailable(state)) {
			// No valid actions available for either player
			gameOver(state, selfScore, otherScore);
		}
	}
};
