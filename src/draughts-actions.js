import { isTileEmpty, isTileSelf, isTileOther, isTileKing, isTileKingable, setTileToEmpty, upgradeTileToKing, moveTile, getDefendingPosition } from "./draughts-board.js";
import { isContinuingAttack, setContinuingAttack } from "./draughts-state.js";

const canTileMove = (state, position) => {
	if (!isTileSelf(state.board, position)) return false;
	
	const { column, row } = position;
	
	// Check for empty (x-1, y-1) and (x+1, y-1) positions
	if (row > 0) {
		if (isTileEmpty(state.board, { column: column - 1, row: row - 1 }) || isTileEmpty(state.board, { column: column + 1, row: row - 1 })) return true;
	}

	// Check king tile for empty (x-1, y+1) and (x+1,y+1) positions as well
	if (isTileKing(state.board, position) && row < state.board.length - 1) {
		if (isTileEmpty(state.board, { column: column - 1, row: row + 1 }) || isTileEmpty(state.board, { column: column + 1, row: row + 1 })) return true;
	}

	return false;
};

const canTileAttack = (state, position) => {
	if (!isTileSelf(state.board, position)) return false;
	
	const { column, row } = position;
	
	// Check for empty (x-2, y-2) and (x+2, y-2) positions and that the defending position contains an other tile
	if (row > 1) {
		if (isTileEmpty(state.board, { column: column - 2, row: row - 2 }) && isTileOther(state.board, getDefendingPosition(position, { column: column - 2, row: row - 2 }))) return true;
		if (isTileEmpty(state.board, { column: column + 2, row: row - 2 }) && isTileOther(state.board, getDefendingPosition(position, { column: column + 2, row: row - 2 }))) return true;
	}
	
	// Check king tile for empty (x-2, y+2) and (x+2,y+2) positions as well, and that the defending position contains an other tile
	if (isTileKing(state.board, position) && row < state.board.length - 2) {
		if (isTileEmpty(state.board, { column: column - 2, row: row + 2 }) && isTileOther(state.board, getDefendingPosition(position, { column: column - 2, row: row + 2 }))) return true;
		if (isTileEmpty(state.board, { column: column + 2, row: row + 2 }) && isTileOther(state.board, getDefendingPosition(position, { column: column + 2, row: row + 2 }))) return true;
	}

	return false;
};

export const isMoveAvailable = (state) => {
	// Check if a valid move exists for the current player
	for (let row = 0; row < state.board.length; row++) {
		for (let column = 0; column < state.board[0].length; column++) {
			if (canTileMove(state, { column, row })) return true;
		}
	}

	return false;
};

export const isAttackAvailable = (state) => {
	// Check if a valid attack exists for the current player
	for (let row = 0; row < state.board.length; row++) {
		for (let column = 0; column < state.board[0].length; column++) {
			if (canTileAttack(state, { column, row })) return true;
		}
	}

	return false;
};

export const isTileSelectable = (state, position) => {
	if (isAttackAvailable(state)) {
		if (canTileAttack(state, position)) return true;
	}
	else {
		if (canTileMove(state, position)) return true;
	}
	return false;
};

export const isMoveValid = (state, startPosition, endPosition) => {
	// Check if tile is available (empty)
	if (!isTileEmpty(state.board, endPosition)) return false;

	// Check if tile is within range
	const distanceX = Math.abs(startPosition.column - endPosition.column);
	const distanceY = Math.abs(startPosition.row - endPosition.row);
	if (distanceX !== 1 || distanceY !== 1) return false;
	
	// Check if travelling in the correct direction, kings can move backwards
	if (!isTileKing(state.board, startPosition) && endPosition.row > startPosition.row) return false;

	// Can only move when no valid attacks exist, must attack when able
	if (isAttackAvailable(state)) return false;

	// Valid Move
	return true;
};

export const isAttackValid = (state, startPosition, endPosition) => {
	// Check if tile is available (empty)
	if (!isTileEmpty(state.board, endPosition)) return false;

	// Check if tile is within range
	const distanceX = Math.abs(startPosition.column - endPosition.column);
	const distanceY = Math.abs(startPosition.row - endPosition.row);
	if (distanceX !== 2 || distanceY !== 2) return false;
	
	// Check if travelling in the correct direction, kings can move backwards
	if (!isTileKing(state.board, startPosition) && endPosition.row > startPosition.row) return false;

	// Check if opponent tile is between selected tile and move position
	if (!isTileOther(state.board, getDefendingPosition(startPosition, endPosition))) return false;

	// Valid Attack
	return true;
};

export const getSelectablePositions = (state) => {
	const positions = [];

	if (isContinuingAttack(state)) {
		positions.push({ ...state.continuingAttack });
		return positions;
	}
	
	if (isAttackAvailable(state)) {
		for (let row = 0; row < state.board.length; row++) {
			for (let column = 0; column < state.board[0].length; column++) {
				if (canTileAttack(state, { column, row })) positions.push({ column, row });
			}
		}
	}
	else {
		for (let row = 0; row < state.board.length; row++) {
			for (let column = 0; column < state.board[0].length; column++) {
				if (canTileMove(state, { column, row })) positions.push({ column, row });
			}
		}
	}

	return positions;
};

const isPositionAttackable = (state, position) => {
	if (!isTileOther(state.board, position) || position.row === 0 || position.row === state.board.length - 1 || position.column === 0 || position.column === state.board[0].length - 1) return false;

	const { column, row } = position;
	if (isTileEmpty(state.board, { column: column - 1, row: row - 1 }) && isTileSelf(state.board, { column: column + 1, row: row + 1 })) return true;
	if (isTileEmpty(state.board, { column: column + 1, row: row - 1 }) && isTileSelf(state.board, { column: column - 1, row: row + 1 })) return true;
	if (isTileEmpty(state.board, { column: column - 1, row: row + 1 }) && isTileSelf(state.board, { column: column + 1, row: row - 1 }) && isTileKing(state.board, { column: column + 1, row: row - 1 })) return true;
	if (isTileEmpty(state.board, { column: column + 1, row: row + 1 }) && isTileSelf(state.board, { column: column - 1, row: row - 1 }) && isTileKing(state.board, { column: column - 1, row: row - 1 })) return true;
	return false;
};

export const getAttackablePositions = (state) => {
	const positions = [];

	for (let row = 0; row < state.board.length; row++) {
		for (let column = 0; column < state.board[0].length; column++) {
			const position = { column, row };
			if (isPositionAttackable(state, position)) positions.push(position);
		}
	}
	
	return positions;
};

export const getValidMovesForTile = (state, position) => {
	const validMoves = [];
	if (!isTileSelf(state.board, position)) return validMoves;
	
	const { column, row } = position;
	let currentPosition;

	// Check for empty (x-1, y-1) and (x+1, y-1) positions
	if (row > 0) {
		currentPosition = { column: column - 1, row: row - 1 };
		if (isTileEmpty(state.board, currentPosition)) validMoves.push(currentPosition);

		currentPosition = { column: column + 1, row: row - 1 };
		if (isTileEmpty(state.board, currentPosition)) validMoves.push(currentPosition);
	}
	
	// Check king tile for empty (x-1, y+1) and (x+1,y+1) positions as well
	if (isTileKing(state.board, position) && row < state.board.length - 1) {
		currentPosition = { column: column - 1, row: row + 1 };
		if (isTileEmpty(state.board, currentPosition)) validMoves.push(currentPosition);

		currentPosition = { column: column + 1, row: row + 1 };
		if (isTileEmpty(state.board, currentPosition)) validMoves.push(currentPosition);
	}

	return validMoves;
};

export const getValidAttacksForTile = (state, position) => {
	const validAttacks = [];
	if (!isTileSelf(state.board, position)) return validAttacks;
	
	const { column, row } = position;
	let currentPosition;
	// Check for empty (x-2, y-2) and (x+2, y-2) positions and that the defending position contains an other tile
	if (row > 1) {
		currentPosition = { column: column - 2, row: row - 2 };
		if (isTileEmpty(state.board, currentPosition) && isTileOther(state.board, getDefendingPosition(position, currentPosition))) validAttacks.push(currentPosition);
		currentPosition = { column: column + 2, row: row - 2 };
		if (isTileEmpty(state.board, currentPosition) && isTileOther(state.board, getDefendingPosition(position, currentPosition))) validAttacks.push(currentPosition);
	}
	
	// Check king tile for empty (x-2, y+2) and (x+2,y+2) positions as well, and that the defending position contains an other tile
	if (isTileKing(state.board, position) && row < state.board.length - 2) {
		currentPosition = { column: column - 2, row: row + 2 };
		if (isTileEmpty(state.board, currentPosition) && isTileOther(state.board, getDefendingPosition(position, currentPosition))) validAttacks.push(currentPosition);
		currentPosition = { column: column + 2, row: row + 2 };
		if (isTileEmpty(state.board, currentPosition) && isTileOther(state.board, getDefendingPosition(position, currentPosition))) validAttacks.push(currentPosition);
	}

	return validAttacks;
};

export const getActions = (state) => {
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

export const actionMove = (state, startPosition, endPosition) => {
	state.board = moveTile(state.board, startPosition, endPosition);
	if (isTileKingable(state.board, endPosition)) state.board = upgradeTileToKing(state.board, endPosition);
};

export const actionAttack = (state, startPosition, endPosition) => {
	// Move own tile and remove opponents
	state.board = setTileToEmpty(state.board, getDefendingPosition(startPosition, endPosition));
	state.board = moveTile(state.board, startPosition, endPosition);

	// If tile can be upgraded to king then do so
	if (isTileKingable(state.board, endPosition)) state.board = upgradeTileToKing(state.board, endPosition);

	// If the attacking tile is able to attack again then control of the board is retained
	if (canTileAttack(state, endPosition)) setContinuingAttack(state, endPosition);
};
