const tileType = {
	EMPTY: 0,
	SELF: 1,
	OTHER: -1,
	SELF_KING: 2,
	OTHER_KING: -2,
};

// Player Turn
export const isRedTurn = (state) => {
	return state.currentPlayer === 1;
};

export const isBlueTurn = (state) => {
	return state.currentPlayer === -1;
};

const swapPlayers = (state) => {
	// Switch between Red and Blue players
	state.currentPlayer *= -1;
	
	// Rotate the board
	for (let row = 0; row < state.board.length; row++) {
		state.board[row].reverse();
		for (let column = 0; column < state.board[0].length; column++) {
			// Set the current player's pieces to positive, other to negative
			state.board[row][column] *= -1;
		}
	}
	state.board.reverse();
};

// Board
export const isValidPosition = (position) => {
	return (position.column % 2 === 0 && position.row % 2 === 1) || (position.column % 2 === 1 && position.row % 2 === 0);
};

const getDefendingPosition = (position1, position2) => {
	// Given positions must be exactly 2 rows and 2 columns apart
	const column = position1.column - ((position1.column - position2.column) / 2);
	const row = position1.row - ((position1.row - position2.row) / 2);
	return { column, row };
};

const getTile = (state, position) => {
	return state.board[position.row][position.column];
};

const isEmptyTile = (state, position) => {
	return getTile(state, position) === tileType.EMPTY;
};

export const isSelfTile = (state, position) => {
	return getTile(state, position) > 0;
};

export const isOtherTile = (state, position) => {
	return getTile(state, position) < 0;
};

export const isKingTile = (state, position) => {
	return Math.abs(getTile(state, position)) === 2;
};

const isKingableTile = (state, position) => {
	return (getTile(state, position) === tileType.SELF && position.row === 0);
};

const tileCanMove = (state, position) => {
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

const tileCanAttack = (state, position) => {
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

const setTile = (state, position, tile) => {
	state.board[position.row][position.column] = tile;
};

const setTileToEmpty = (state, position) => {
	setTile(state, position, tileType.EMPTY);
};

const setTileToSelectedTile = (state, position) => {
	setTile(state, position, getTile(state, state.selectedPosition));
};

const upgradeTileToKing = (state, position) => {
	setTile(state, position, tileType.SELF_KING);
};

// Selected Position
const setSelectedPosition = (state, position) => {
	// Destructed to get a copy
	const { column, row } = position;
	state.selectedPosition = { column, row };
};

export const resetSelectedPosition = (state) => {
	state.selectedPosition = { column: null, row: null };
};

const isSelectedPosition = (state, position) => {
	return state.selectedPosition.column === position.column && state.selectedPosition.row === position.row;
};

export const hasSelectedPosition = (state) => {
	return !(state.selectedPosition.column == null || state.selectedPosition.row == null);
};

// Continuing Attack
export const isContinuingAttack = (state) => {
	return state.continuingAttack.column !== null && state.continuingAttack.row !== null;
};

const setContinuingAttack = (state, position) => {
	state.continuingAttack = { ...position };
	setSelectedPosition(state, position);
};

const resetContinuingAttack = (state) => {
	state.continuingAttack = { column: null, row: null };
};

// Actions
const moveIsAvailable = (state) => {
	// Check if a valid move exists for the current player
	for (let row = 0; row < state.board.length; row++) {
		for (let column = 0; column < state.board[0].length; column++) {
			if (tileCanMove(state, { column, row })) return true;
		}
	}

	return false;
};

const attackIsAvailable = (state) => {
	// Check if a valid attack exists for the current player
	for (let row = 0; row < state.board.length; row++) {
		for (let column = 0; column < state.board[0].length; column++) {
			if (tileCanAttack(state, { column, row })) return true;
		}
	}

	return false;
};

export const getValidMovesForTile = (state, position) => {
	const validMoves = [];
	if (!isSelfTile(state, position)) return validMoves;
	
	const { column, row } = position;
	let currentPosition;

	// Check for empty (x-1, y-1) and (x+1, y-1) positions
	if (row > 0) {
		currentPosition = { column: column - 1, row: row - 1 };
		if (isEmptyTile(state, currentPosition)) validMoves.push(currentPosition);

		currentPosition = { column: column + 1, row: row - 1 };
		if (isEmptyTile(state, currentPosition)) validMoves.push(currentPosition);
	}
	
	// Check king tile for empty (x-1, y+1) and (x+1,y+1) positions as well
	if (isKingTile(state, position) && row < state.board.length - 1) {
		currentPosition = { column: column - 1, row: row + 1 };
		if (isEmptyTile(state, currentPosition)) validMoves.push(currentPosition);

		currentPosition = { column: column + 1, row: row + 1 };
		if (isEmptyTile(state, currentPosition)) validMoves.push(currentPosition);
	}

	return validMoves;
};

export const getValidAttacksForTile = (state, position) => {
	const validAttacks = [];
	if (!isSelfTile(state, position)) return validAttacks;
	
	const { column, row } = position;
	let currentPosition;
	// Check for empty (x-2, y-2) and (x+2, y-2) positions and that the defending position contains an other tile
	if (row > 1) {
		currentPosition = { column: column - 2, row: row - 2 };
		if (isEmptyTile(state, currentPosition) && isOtherTile(state, getDefendingPosition(position, currentPosition))) validAttacks.push(currentPosition);
		currentPosition = { column: column + 2, row: row - 2 };
		if (isEmptyTile(state, currentPosition) && isOtherTile(state, getDefendingPosition(position, currentPosition))) validAttacks.push(currentPosition);
	}
	
	// Check king tile for empty (x-2, y+2) and (x+2,y+2) positions as well, and that the defending position contains an other tile
	if (isKingTile(state, position) && row < state.board.length - 2) {
		currentPosition = { column: column - 2, row: row + 2 };
		if (isEmptyTile(state, currentPosition) && isOtherTile(state, getDefendingPosition(position, currentPosition))) validAttacks.push(currentPosition);
		currentPosition = { column: column + 2, row: row + 2 };
		if (isEmptyTile(state, currentPosition) && isOtherTile(state, getDefendingPosition(position, currentPosition))) validAttacks.push(currentPosition);
	}

	return validAttacks;
};

const isValidMove = (state, position) => {
	// Check if tile is available (empty)
	if (!isEmptyTile(state, position)) return false;

	// Check if tile is within range
	const distanceX = Math.abs(state.selectedPosition.column - position.column);
	const distanceY = Math.abs(state.selectedPosition.row - position.row);
	if (distanceX !== 1 || distanceY !== 1) return false;
	
	// Check if travelling in the correct direction, kings can move backwards
	if (!isKingTile(state, state.selectedPosition) && position.row > state.selectedPosition.row) return false;

	// Can only move when no valid attacks exist, must attack when able
	if (attackIsAvailable(state)) return false;

	// Valid Move
	return true;
};

const isValidAttack = (state, position) => {
	// Check if tile is available (empty)
	if (!isEmptyTile(state, position)) return false;

	// Check if tile is within range
	const distanceX = Math.abs(state.selectedPosition.column - position.column);
	const distanceY = Math.abs(state.selectedPosition.row - position.row);
	if (distanceX !== 2 || distanceY !== 2) return false;
	
	// Check if travelling in the correct direction, kings can move backwards
	if (!isKingTile(state, state.selectedPosition) && position.row > state.selectedPosition.row) return false;

	// Check if opponent tile is between selected tile and move position
	if (!isOtherTile(state, getDefendingPosition(position, state.selectedPosition))) return false;

	// Valid Attack
	return true;
};

const move = (state, position) => {
	setTileToSelectedTile(state, position);
	setTileToEmpty(state, state.selectedPosition);
	resetSelectedPosition(state);
	if (isKingableTile(state, position)) upgradeTileToKing(state, position);
};

const attack = (state, position) => {
	setTileToEmpty(state, getDefendingPosition(position, state.selectedPosition));
	setTileToSelectedTile(state, position);
	setTileToEmpty(state, state.selectedPosition);
	resetSelectedPosition(state);
	if (isKingableTile(state, position)) upgradeTileToKing(state, position);
};

// State
const resetGame = (state) => {
	state.currentPlayer = 1;
	state.selectedPosition = { column: null, row: null };
	state.continuingAttack = { column: null, row: null };

	const columns = state.board[0].length;
	const rows = state.board.length;
	for (let row = 0; row < rows; row++) {
		for (let column = 0; column < columns; column++) {
			const position = { column, row };
			if (isValidPosition(position)) {
				if (row < 3) setTile(state, position, tileType.OTHER);
				else if (row >= rows - 3) setTile(state, position, tileType.SELF);
				else setTileToEmpty(state, position);
			}
			else {
				setTileToEmpty(state, position);
			}
		}
	}
};

export const createState = () => {
	// Create representation of the game board using a 2d array
	const columns = 8;
	const rows = 8;
	const board = [];

	for (let row = 0; row < rows; row++) {
		board[row] = [];
		for (let column = 0; column < columns; column++) {
			if (isValidPosition({ column, row })) {
				if (row < 3) board[row][column] = tileType.OTHER;
				else if (row >= rows - 3) board[row][column] = tileType.SELF;
				else board[row][column] = tileType.EMPTY;
			}
			else {
				board[row][column] = tileType.EMPTY;
			}
		}
	}

	return {
		board,
		currentPlayer: 1,
		selectedPosition: { column: null, row: null },
		continuingAttack: { column: null, row: null },
		redWins: 0,
		blueWins: 0,
	};
};

const scoreTheBoard = (state) => {
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
	return { selfScore, otherScore };
};

const gameOver = (state, selfScore, otherScore) => {
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

	resetGame(state);
};

const nextTurn = (state) => {
	// Check if player has won
	const { selfScore, otherScore } = scoreTheBoard(state);
	if (otherScore === 0) {
		gameOver(state, selfScore, otherScore);
		return;
	}

	// Rotate the board and change which team is self
	swapPlayers(state);
	
	if (!moveIsAvailable(state) && !attackIsAvailable(state)) {
		swapPlayers(state);
		if (!moveIsAvailable(state) && !attackIsAvailable(state)) {
			// No valid actions available for either player
			gameOver(state, selfScore, otherScore);
		}
	}
};

export const action = (state, position) => {
	// Check if the position is playable (black chequer)
	if (!isValidPosition(position)) return;

	// If continuing attack
	if (isContinuingAttack(state)) {
		if (isValidAttack(state, position)) {
			resetContinuingAttack(state);
			attack(state, position);
			if (tileCanAttack(state, position)) setContinuingAttack(state, position);
			else nextTurn(state);
		}
		return;
	}

	// If clicked own tile then select and return, only select tiles with valid actions
	if (isSelfTile(state, position)) {
		if (attackIsAvailable(state)) {
			if (!tileCanAttack(state, position)) return;
		}
		else {
			if (!tileCanMove(state, position)) return;
		}

		if (isSelectedPosition(state, position)) resetSelectedPosition(state);
		else setSelectedPosition(state, position);

		return;
	}

	// If no tile selected then return
	if (!hasSelectedPosition(state)) return;

	// Check if clicked position is a valid move/attack for the selected tile
	if (isValidMove(state, position)) {
		move(state, position);
		nextTurn(state);
	}
	else if (isValidAttack(state, position)) {
		attack(state, position);
		if (tileCanAttack(state, position)) setContinuingAttack(state, position);
		else nextTurn(state);
	}
};

export const getSelectablePositions = (state) => {
	const positions = [];

	if (isContinuingAttack(state)) {
		positions.push({ ...state.continuingAttack });
		return positions;
	}
	
	if (attackIsAvailable(state)) {
		for (let row = 0; row < state.board.length; row++) {
			for (let column = 0; column < state.board[0].length; column++) {
				if (tileCanAttack(state, { column, row })) positions.push({ column, row });
			}
		}	
	}
	else {
		for (let row = 0; row < state.board.length; row++) {
			for (let column = 0; column < state.board[0].length; column++) {
				if (tileCanMove(state, { column, row })) positions.push({ column, row });
			}
		}
	}

	return positions;
};

const getActions = (state) => {
	const actions = [];

	const positions = getSelectablePositions(state);
	positions.forEach((position) => {
		const attackPositions = getValidAttacksForTile(state, position);
		attackPositions.forEach((attackPosition) => {
			actions.push([{ ...position }, { ...attackPosition }]);
		});
	});
	if (actions.length === 0) {
		positions.forEach((position) => {
			const movePositions = getValidMovesForTile(state, position);
			movePositions.forEach((movePosition) => {
				actions.push([{ ...position }, { ...movePosition }]);
			});
		});
	}

	return actions;
};
