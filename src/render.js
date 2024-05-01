import { isSelfTile, isOtherTile } from "./board.js";
import { isValidPosition, isKingTile } from "./draughts.js";
import { getValidMovesForTile, getValidAttacksForTile, getSelectablePositions } from "./actions.js";
import { isRedTurn, isBlueTurn, hasSelectedPosition } from "./play.js";

const tileSize = 64;
const colour = {
	GRID: "#333333",
	SELECTED: "#00ff00",
	VALID: "#ffff00",
};

const redTile = new Image();
redTile.src = "./img/tile-red.png";

const blueTile = new Image();
blueTile.src = "./img/tile-blue.png";

const redKingTile = new Image();
redKingTile.src = "./img/king-tile-red.png";

const blueKingTile = new Image();
blueKingTile.src = "./img/king-tile-blue.png";

const moveIcon = new Image();
moveIcon.src = "./img/icon-move.png";

const attackIcon = new Image();
attackIcon.src = "./img/icon-attack.png";

const loadImage = (image) => {
	return new Promise((resolve, reject) => {
		image.onload = () => resolve(image);
		image.onerror = reject;
	});
};

const loadImages = async (images) => {
	await Promise.all(images.map((image) => loadImage(image)));
};

export const initImages = async () => {
	await loadImages([redTile, blueTile, redKingTile, blueKingTile, moveIcon, attackIcon]);
};

const resetViewport = (ctx, state) => {
	ctx.clearRect(0, 0, state.board[0].length * tileSize, state.board.length * tileSize);
};

const drawChequer = (ctx, position) => {
	if (isValidPosition(position)) {
		ctx.fillStyle = colour.GRID;
		ctx.fillRect(position.column * tileSize, position.row * tileSize, tileSize, tileSize);
	}
	else {
		ctx.strokeStyle = colour.GRID;
		ctx.lineWidth = 1;
		ctx.strokeRect(position.column * tileSize, position.row * tileSize, tileSize, tileSize);
	}
};

const drawTile = (ctx, state, position) => {
	if ((isRedTurn(state) && isSelfTile(state, position)) || (isBlueTurn(state) && isOtherTile(state, position))) {
		// Red Tile
		ctx.drawImage(isKingTile(state, position) ? redKingTile : redTile, position.column * tileSize, position.row * tileSize, tileSize, tileSize);
	}
	else if ((isBlueTurn(state) && isSelfTile(state, position)) || (isRedTurn(state) && isOtherTile(state, position))) {
		// Blue Tile
		ctx.drawImage(isKingTile(state, position) ? blueKingTile : blueTile, position.column * tileSize, position.row * tileSize, tileSize, tileSize);
	}
};

const drawSelectedPosition = (ctx, state) => {
	// Draw selected position highlight
	ctx.strokeStyle = colour.SELECTED;
	ctx.lineWidth = 3;
	ctx.strokeRect(state.selectedPosition.column * tileSize, state.selectedPosition.row * tileSize, tileSize, tileSize);
};

const drawValidActions = (ctx, state) => {
	// Draw valid action icons for selected tile
	const validAttacks = getValidAttacksForTile(state, state.selectedPosition);
	validAttacks.forEach((position) => {
		ctx.drawImage(attackIcon, position.column * tileSize, position.row * tileSize, tileSize, tileSize);
	});

	// Draw valid move icons for selected tile, if cannot attack
	if (validAttacks.length === 0) {
		const validMoves = getValidMovesForTile(state, state.selectedPosition);
		validMoves.forEach((position) => {
			ctx.drawImage(moveIcon, position.column * tileSize, position.row * tileSize, tileSize, tileSize);
		});
	}
};

const drawSelectablePositions = (ctx, state) => {
	const positions = getSelectablePositions(state);
	ctx.strokeStyle = colour.VALID;
	ctx.lineWidth = 3;
	positions.forEach((position) => {
		ctx.strokeRect(position.column * tileSize, position.row * tileSize, tileSize, tileSize);
	});
};

export const draw = (canvas, state) => {
	const ctx = canvas.getContext("2d");
	const columns = state.board[0].length;
	const rows = state.board.length;

	resetViewport(ctx, state);
	
	for (let row = 0; row < rows; row++) {
		for (let column = 0; column < columns; column++) {
			const position = { column, row };
			drawChequer(ctx, position);
			drawTile(ctx, state, position);
		}
	}

	if (hasSelectedPosition(state)) {
		drawSelectedPosition(ctx, state);
		drawValidActions(ctx, state);
	}
	else {
		drawSelectablePositions(ctx, state);
	}
};

export const resizeCanvas = (canvas, state) => {
	canvas.setAttribute("width", state.board[0].length * tileSize);
	canvas.setAttribute("height", state.board.length * tileSize);
};

export const getPositionFromClick = (event) => {
	const pixelX = event.clientX - event.target.offsetLeft;
	const pixelY = event.clientY - event.target.offsetTop;
	const column = (pixelX - (pixelX % tileSize)) / tileSize;
	const row = (pixelY - (pixelY % tileSize)) / tileSize;
	return { column, row };
};
