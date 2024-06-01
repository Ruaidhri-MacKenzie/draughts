import { getTile, setTile, createBoard } from "./board.js";

const tiles = {
	EMPTY: 0,
	SELF: 1,
	OTHER: -1,
	SELF_KING: 2,
	OTHER_KING: -2,
};

export const isTileEmpty = (board, position) => {
	return getTile(board, position) === tiles.EMPTY;
};

export const isTileSelf = (board, position) => {
	return getTile(board, position) > 0;
};

export const isTileOther = (board, position) => {
	return getTile(board, position) < 0;
};

export const isTileKing = (board, position) => {
	return Math.abs(getTile(board, position)) === tiles.SELF_KING;
};

export const isTileKingable = (board, position) => {
	return (position.row === 0 && !isTileEmpty(board, position) && !isTileKing(board, position));
};

export const setTileToEmpty = (board, position) => {
	return setTile(board, position, tiles.EMPTY);
};

export const setTileToSelf = (board, position) => {
	return setTile(board, position, tiles.SELF);
};

export const setTileToOther = (board, position) => {
	return setTile(board, position, tiles.OTHER);
};

export const upgradeTileToKing = (board, position) => {
	return setTile(board, position, tiles.SELF_KING);
};

export const moveTile = (board, startPosition, endPosition) => {
	return setTileToEmpty(setTile(board, endPosition, getTile(board, startPosition)), startPosition);
};

export const isPositionValid = (position) => {
	return (position.column % 2 === 0 && position.row % 2 === 1) || (position.column % 2 === 1 && position.row % 2 === 0);
};

export const getDefendingPosition = (startPosition, endPosition) => {
	// Given positions must be exactly 2 rows and 2 columns apart
	const column = startPosition.column - ((startPosition.column - endPosition.column) / 2);
	const row = startPosition.row - ((startPosition.row - endPosition.row) / 2);
	return { column, row };
};

export const resetDraughtsBoard = (board) => {
	const columns = board[0].length;
	const rows = board.length;
	
	for (let row = 0; row < rows; row++) {
		for (let column = 0; column < columns; column++) {
			const position = { column, row };
			if (isPositionValid(position)) {
				if (row < 3) board = setTileToOther(board, position);
				else if (row >= rows - 3) board = setTileToSelf(board, position);
				else board = setTileToEmpty(board, position);
			}
			else {
				board = setTileToEmpty(board, position);
			}
		}
	}

	return board;
};

export const createDraughtsBoard = () => {
	const columns = 8;
	const rows = 8;
	return resetDraughtsBoard(createBoard(columns, rows));
};
