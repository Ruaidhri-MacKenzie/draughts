import { getTile, setTile, createBoard } from "./board.js";

const tiles = {
	EMPTY: 0,
	SELF_PAWN: 1,
	OTHER_PAWN: -1,
	SELF_ROOK: 2,
	OTHER_ROOK: -2,
	SELF_KNIGHT: 3,
	OTHER_KNIGHT: -3,
	SELF_BISHOP: 4,
	OTHER_BISHOP: -4,
	SELF_QUEEN: 5,
	OTHER_QUEEN: -5,
	SELF_KING: 6,
	OTHER_KING: -6,
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

export const isTilePawn = (board, position) => {
	return Math.abs(getTile(board, position)) === 1;
};

export const isTileRook = (board, position) => {
	return Math.abs(getTile(board, position)) === 2;
};

export const isTileKnight = (board, position) => {
	return Math.abs(getTile(board, position)) === 3;
};

export const isTileBishop = (board, position) => {
	return Math.abs(getTile(board, position)) === 4;
};

export const isTileQueen = (board, position) => {
	return Math.abs(getTile(board, position)) === 5;
};

export const isTileKing = (board, position) => {
	return Math.abs(getTile(board, position)) === 6;
};

export const setTileToEmpty = (board, position) => {
	return setTile(board, position, tiles.EMPTY);
};

export const moveTile = (board, startPosition, endPosition) => {
	return setTileToEmpty(setTile(board, endPosition, getTile(board, startPosition)), startPosition);
};

export const resetChessBoard = (board) => {
	const columns = board[0].length;
	const rows = board.length;
	for (let row = 0; row < rows; row++) {
		for (let column = 0; column < columns; column++) {
			const position = { column, row };

			if (row === 0) {
				if (column === 0 || column === 7) board = setTile(board, position, tiles.OTHER_ROOK);
				else if (column === 1 || column === 6) board = setTile(board, position, tiles.OTHER_KNIGHT);
				else if (column === 2 || column === 5) board = setTile(board, position, tiles.OTHER_BISHOP);
				else if (column === 3) board = setTile(board, position, tiles.OTHER_KING);
				else if (column === 4) board = setTile(board, position, tiles.OTHER_QUEEN);
			}
			else if (row === 1) board = setTile(board, position, tiles.OTHER_PAWN);
			else if (row === 6) board = setTile(board, position, tiles.SELF_PAWN);
			else if (row === 7) {
				if (column === 0 || column === 7) board = setTile(board, position, tiles.SELF_ROOK);
				else if (column === 1 || column === 6) board = setTile(board, position, tiles.SELF_KNIGHT);
				else if (column === 2 || column === 5) board = setTile(board, position, tiles.SELF_BISHOP);
				else if (column === 3) board = setTile(board, position, tiles.SELF_QUEEN);
				else if (column === 4) board = setTile(board, position, tiles.SELF_KING);
			}
			else board = setTileToEmpty(board, position);
		}
	}

	return board;
};

export const createChessBoard = () => {
	const columns = 8;
	const rows = 8;
	return resetChessBoard(createBoard(columns, rows));
};
