import { isTileSelf, isTileOther, isTileKing } from "./draughts-board.js";
import { getValidMovesForTile, getValidAttacksForTile, getSelectablePositions, getAttackablePositions } from "./draughts-actions.js";
import { isPlayerOneTurn, isPlayerTwoTurn } from "./play.js";
import { hasSelectedPosition } from "./draughts-input.js";
import { tileSize, images, addImage, resetViewport, drawChequer, drawSelectedPosition } from "./render.js";

export const initDraughtsImages = async () => {
	return Promise.all([
		addImage("redTile", "./img/tile-red.png"),
		addImage("blueTile", "./img/tile-blue.png"),
		addImage("redKingTile", "./img/king-tile-red.png"),
		addImage("blueKingTile", "./img/king-tile-blue.png"),
	]);
};

const drawTile = (ctx, state, position) => {
	if ((isPlayerOneTurn(state) && isTileSelf(state.board, position)) || (isPlayerTwoTurn(state) && isTileOther(state.board, position))) {
		// Red Tile
		const image = isTileKing(state.board, position) ? images.redKingTile : images.redTile;
		ctx.drawImage(image, position.column * tileSize, position.row * tileSize, tileSize, tileSize);
	}
	else if ((isPlayerTwoTurn(state) && isTileSelf(state.board, position)) || (isPlayerOneTurn(state) && isTileOther(state.board, position))) {
		// Blue Tile
		const image = isTileKing(state.board, position) ? images.blueKingTile : images.blueTile;
		ctx.drawImage(image, position.column * tileSize, position.row * tileSize, tileSize, tileSize);
	}
};

const drawValidActions = (ctx, state) => {
	// Draw valid action icons for selected tile
	const validAttacks = getValidAttacksForTile(state, state.selectedPosition);
	validAttacks.forEach((position) => {
		ctx.drawImage(images.attackIcon, position.column * tileSize, position.row * tileSize, tileSize, tileSize);
	});

	// Draw valid move icons for selected tile, if cannot attack
	if (validAttacks.length === 0) {
		const validMoves = getValidMovesForTile(state, state.selectedPosition);
		validMoves.forEach((position) => {
			ctx.drawImage(images.moveIcon, position.column * tileSize, position.row * tileSize, tileSize, tileSize);
		});
	}
};

const drawSelectablePositions = (ctx, state) => {
	const positions = getSelectablePositions(state);
	positions.forEach((position) => {
		ctx.drawImage(images.selectableIcon, position.column * tileSize, position.row * tileSize, tileSize, tileSize);
	});
};

const drawAttackablePositions = (ctx, state) => {
	const positions = getAttackablePositions(state);
	positions.forEach((position) => {
		ctx.drawImage(images.attackableIcon, position.column * tileSize, position.row * tileSize, tileSize, tileSize);
	});
};

export const draughtsDraw = (canvas, state) => {
	const ctx = canvas.getContext("2d");
	const columns = state.board[0].length;
	const rows = state.board.length;

	resetViewport(ctx, state);
	const gridColour = getComputedStyle(canvas).getPropertyValue("--colour-grid");

	for (let row = 0; row < rows; row++) {
		for (let column = 0; column < columns; column++) {
			const position = { column, row };
			drawChequer(ctx, position, gridColour);
			drawTile(ctx, state, position);
		}
	}

	if (hasSelectedPosition(state)) {
		drawSelectedPosition(ctx, state);
		drawValidActions(ctx, state);
		drawAttackablePositions(ctx, state);
	}
	else {
		drawSelectablePositions(ctx, state);
	}
};
