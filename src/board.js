const tiles = {
	EMPTY: 0,
	SELF_TILE: 1,
	OTHER_TILE: -1,
};

export const getTile = (state, position) => {
	return state.board[position.row][position.column];
};

export const isEmptyTile = (state, position) => {
	return getTile(state, position) === tiles.EMPTY;
};

export const isSelfTile = (state, position) => {
	return getTile(state, position) > 0;
};

export const isOtherTile = (state, position) => {
	return getTile(state, position) < 0;
};

export const setTile = (state, position, tile) => {
	state.board[position.row][position.column] = tile;
};

export const setTileToEmpty = (state, position) => {
	setTile(state, position, tiles.EMPTY);
};

export const setTileToSelf = (state, position) => {
	setTile(state, position, tiles.SELF_TILE);
};

export const setTileToOther = (state, position) => {
	setTile(state, position, tiles.OTHER_TILE);
};

export const moveTile = (state, startPosition, endPosition) => {
	setTile(state, endPosition, getTile(state, startPosition));
	setTileToEmpty(state, startPosition);
};

export const createBoard = (columns, rows) => {
	const board = [];

	for (let row = 0; row < rows; row++) {
		board[row] = [];
		for (let column = 0; column < columns; column++) {
			board[row][column] = tiles.EMPTY;
		}
	}

	return board;
};

export const rotateBoard = (state) => {
	for (let row = 0; row < state.board.length; row++) {
		state.board[row].reverse();
		for (let column = 0; column < state.board[0].length; column++) {
			// Set the current player's pieces to positive, other to negative
			state.board[row][column] *= -1;
		}
	}
	state.board.reverse();
};
