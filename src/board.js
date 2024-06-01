export const createBoard = (columns, rows) => {
	return Array.from(Array(rows), () => new Array(columns).fill(null));
};

export const rotateBoard = (board) => {
	return board.map((row) => row.toReversed().map((tile) => tile * -1)).toReversed();
};

export const cloneBoard = (board) => {
	return board.map((row) => row.map((column) => column));
};

export const getTile = (board, position) => {
	return board[position.row][position.column];
};

export const setTile = (board, position, tile) => {
	const newBoard = cloneBoard(board);
	newBoard[position.row][position.column] = tile;
	return newBoard;
};
