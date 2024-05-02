export const getTile = (state, position) => {
	return state.board[position.row][position.column];
};

export const setTile = (state, position, tile) => {
	state.board[position.row][position.column] = tile;
};

export const createBoard = (columns, rows) => {
	return Array.from(Array(rows), () => new Array(columns).fill(null));
};

export const rotateBoard = (state) => {
	state.board = state.board.map((row) => row.toReversed().map((tile) => tile * -1)).toReversed();
};
