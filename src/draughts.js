import { getTile, isEmptyTile, isSelfTile, isOtherTile, setTile, setTileToEmpty, setTileToSelf, setTileToOther, createBoard } from "./board.js";

const tiles = {
	EMPTY: 0,
	SELF_TILE: 1,
	OTHER_TILE: -1,
	SELF_KING: 2,
	OTHER_KING: -2,
};

// Draughts Board
export const isValidPosition = (position) => {
	return (position.column % 2 === 0 && position.row % 2 === 1) || (position.column % 2 === 1 && position.row % 2 === 0);
};

export const getDefendingPosition = (startPosition, endPosition) => {
	// Given positions must be exactly 2 rows and 2 columns apart
	const column = startPosition.column - ((startPosition.column - endPosition.column) / 2);
	const row = startPosition.row - ((startPosition.row - endPosition.row) / 2);
	return { column, row };
};

export const isKingTile = (state, position) => {
	return Math.abs(getTile(state, position)) === tiles.SELF_KING;
};

export const isKingableTile = (state, position) => {
	return (position.row === 0 && !isEmptyTile(state, position) && !isKingTile(state, position));
};

export const upgradeTileToKing = (state, position) => {
	setTile(state, position, tiles.SELF_KING);
};

export const tileCanMove = (state, position) => {
	if (!isSelfTile(state, position)) return false;
	
	const { column, row } = position;
	
	// Check for empty (x-1, y-1) and (x+1, y-1) positions
	if (row > 0) {
		if (isEmptyTile(state, { column: column - 1, row: row - 1 }) || isEmptyTile(state, { column: column + 1, row: row - 1 })) return true;
	}

	// Check king tile for empty (x-1, y+1) and (x+1,y+1) positions as well
	if (isKingTile(state, position) && row < state.board.length - 1) {
		if (isEmptyTile(state, { column: column - 1, row: row + 1 }) || isEmptyTile(state, { column: column + 1, row: row + 1 })) return true;
	}

	return false;
};

export const tileCanAttack = (state, position) => {
	if (!isSelfTile(state, position)) return false;
	
	const { column, row } = position;
	
	// Check for empty (x-2, y-2) and (x+2, y-2) positions and that the defending position contains an other tile
	if (row > 1) {
		if (isEmptyTile(state, { column: column - 2, row: row - 2 }) && isOtherTile(state, getDefendingPosition(position, { column: column - 2, row: row - 2 }))) return true;
		if (isEmptyTile(state, { column: column + 2, row: row - 2 }) && isOtherTile(state, getDefendingPosition(position, { column: column + 2, row: row - 2 }))) return true;
	}
	
	// Check king tile for empty (x-2, y+2) and (x+2,y+2) positions as well, and that the defending position contains an other tile
	if (isKingTile(state, position) && row < state.board.length - 2) {
		if (isEmptyTile(state, { column: column - 2, row: row + 2 }) && isOtherTile(state, getDefendingPosition(position, { column: column - 2, row: row + 2 }))) return true;
		if (isEmptyTile(state, { column: column + 2, row: row + 2 }) && isOtherTile(state, getDefendingPosition(position, { column: column + 2, row: row + 2 }))) return true;
	}

	return false;
};

export const createDraughtsBoard = () => {
	const columns = 8;
	const rows = 8;
	const board = createBoard(columns, rows);

	for (let row = 0; row < rows; row++) {
		for (let column = 0; column < columns; column++) {
			if (isValidPosition({ column, row })) {
				if (row < 3) board[row][column] = tiles.OTHER_TILE;
				else if (row >= rows - 3) board[row][column] = tiles.SELF_TILE;
			}
		}
	}

	return board;
};

export const resetDraughtsBoard = (state) => {
	const columns = state.board[0].length;
	const rows = state.board.length;
	for (let row = 0; row < rows; row++) {
		for (let column = 0; column < columns; column++) {
			const position = { column, row };
			if (isValidPosition(position)) {
				if (row < 3) setTileToOther(state, position);
				else if (row >= rows - 3) setTileToSelf(state, position);
				else setTileToEmpty(state, position);
			}
			else {
				setTileToEmpty(state, position);
			}
		}
	}
};

export const moveIsAvailable = (state) => {
	// Check if a valid move exists for the current player
	for (let row = 0; row < state.board.length; row++) {
		for (let column = 0; column < state.board[0].length; column++) {
			if (tileCanMove(state, { column, row })) return true;
		}
	}

	return false;
};

export const attackIsAvailable = (state) => {
	// Check if a valid attack exists for the current player
	for (let row = 0; row < state.board.length; row++) {
		for (let column = 0; column < state.board[0].length; column++) {
			if (tileCanAttack(state, { column, row })) return true;
		}
	}

	return false;
};

export const tileIsSelectable = (state, position) => {
	if (attackIsAvailable(state)) {
		if (tileCanAttack(state, position)) return true;
	}
	else {
		if (tileCanMove(state, position)) return true;
	}
	return false;
};

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
	resetDraughtsBoard(state);
};

export const updateState = (state, action) => {
	// Action = [startPosition, endPosition]

	const columns = 8;
	const rows = 8;

	// Create board
	const board = Array.from(Array(rows), () => new Array(columns).fill(0));

	// Rotate the board
	board.map((row) => row.toReversed().map((tile) => tile * -1)).toReversed();

};

export const scoreState = (state) => {
	// Adds all tiles together. Normal tiles are worth 1 each, kings are worth 2.
	// Positive score means current player is winning. Negative score means opponent is winning.
	return state.board.reduce((acc1, cur1) => acc1 + cur1.reduce((acc2, cur2) => acc2 + cur2), 0);
};
