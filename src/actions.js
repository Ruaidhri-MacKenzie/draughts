import { isEmptyTile, isSelfTile, isOtherTile, setTileToEmpty, moveTile, getDefendingPosition, isKingTile, isKingableTile, upgradeTileToKing, tileCanAttack, tileCanMove, attackIsAvailable, isContinuingAttack, setContinuingAttack } from "./draughts.js";

export const isValidMove = (state, startPosition, endPosition) => {
	// Check if tile is available (empty)
	if (!isEmptyTile(state, endPosition)) return false;

	// Check if tile is within range
	const distanceX = Math.abs(startPosition.column - endPosition.column);
	const distanceY = Math.abs(startPosition.row - endPosition.row);
	if (distanceX !== 1 || distanceY !== 1) return false;
	
	// Check if travelling in the correct direction, kings can move backwards
	if (!isKingTile(state, startPosition) && endPosition.row > startPosition.row) return false;

	// Can only move when no valid attacks exist, must attack when able
	if (attackIsAvailable(state)) return false;

	// Valid Move
	return true;
};

export const isValidAttack = (state, startPosition, endPosition) => {
	// Check if tile is available (empty)
	if (!isEmptyTile(state, endPosition)) return false;

	// Check if tile is within range
	const distanceX = Math.abs(startPosition.column - endPosition.column);
	const distanceY = Math.abs(startPosition.row - endPosition.row);
	if (distanceX !== 2 || distanceY !== 2) return false;
	
	// Check if travelling in the correct direction, kings can move backwards
	if (!isKingTile(state, startPosition) && endPosition.row > startPosition.row) return false;

	// Check if opponent tile is between selected tile and move position
	if (!isOtherTile(state, getDefendingPosition(startPosition, endPosition))) return false;

	// Valid Attack
	return true;
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

export const isAttackablePosition = (state, position) => {
	if (!isOtherTile(state, position) || position.row === 0 || position.row === state.board.length - 1 || position.column === 0 || position.column === state.board[0].length - 1) return false;

	const { column, row } = position;
	if (isEmptyTile(state, { column: column - 1, row: row - 1 }) && isSelfTile(state, { column: column + 1, row: row + 1 })) return true;
	if (isEmptyTile(state, { column: column + 1, row: row - 1 }) && isSelfTile(state, { column: column - 1, row: row + 1 })) return true;
	if (isEmptyTile(state, { column: column - 1, row: row + 1 }) && isSelfTile(state, { column: column + 1, row: row - 1 }) && isKingTile(state, { column: column + 1, row: row - 1 })) return true;
	if (isEmptyTile(state, { column: column + 1, row: row + 1 }) && isSelfTile(state, { column: column - 1, row: row - 1 }) && isKingTile(state, { column: column - 1, row: row - 1 })) return true;
	return false;
};

export const getAttackablePositions = (state) => {
	const positions = [];

	for (let row = 0; row < state.board.length; row++) {
		for (let column = 0; column < state.board[0].length; column++) {
			const position = { column, row };
			if (isAttackablePosition(state, position)) positions.push(position);
		}
	}
	
	return positions;
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
	moveTile(state, startPosition, endPosition);
	if (isKingableTile(state, endPosition)) upgradeTileToKing(state, endPosition);
};

export const actionAttack = (state, startPosition, endPosition) => {
	// Move own tile and remove opponents
	setTileToEmpty(state, getDefendingPosition(startPosition, endPosition));
	moveTile(state, startPosition, endPosition);

	// If tile can be upgraded to king then do so
	if (isKingableTile(state, endPosition)) upgradeTileToKing(state, endPosition);

	// If the attacking tile is able to attack again then control of the board is retained
	if (tileCanAttack(state, endPosition)) setContinuingAttack(state, endPosition);
};
