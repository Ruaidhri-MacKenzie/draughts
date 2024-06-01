export const tileSize = 64;
export const colours = {
	GRID: "#333333",
};
export const images = {};

const loadImage = async (image) => {
	return new Promise((resolve, reject) => {
		image.onload = () => resolve(image);
		image.onerror = reject;
	});
};

export const addImage = async (name, imagePath) => {
	const image = new Image();
	image.src = imagePath;
	await loadImage(image);
	images[name] = image;
};

export const initIconImages = async () => {
	return Promise.all([
		addImage("moveIcon", "./img/icon-move.png"),
		addImage("attackIcon", "./img/icon-attack.png"),
		addImage("selectableIcon", "./img/icon-selectable.png"),
		addImage("selectedIcon", "./img/icon-selected.png"),
		addImage("attackableIcon", "./img/icon-attackable.png"),
	]);
};

export const resetViewport = (ctx, state) => {
	ctx.clearRect(0, 0, state.board[0].length * tileSize, state.board.length * tileSize);
};

export const drawChequer = (ctx, position, gridColour) => {
	if ((position.column % 2 === 0 && position.row % 2 === 1) || (position.column % 2 === 1 && position.row % 2 === 0)) {
		ctx.fillStyle = gridColour;
		ctx.fillRect(position.column * tileSize, position.row * tileSize, tileSize, tileSize);
	}
	else {
		ctx.strokeStyle = gridColour;
		ctx.lineWidth = 1;
		ctx.strokeRect(position.column * tileSize, position.row * tileSize, tileSize, tileSize);
	}
};

export const drawSelectedPosition = (ctx, state) => {
	ctx.drawImage(images.selectedIcon, state.selectedPosition.column * tileSize, state.selectedPosition.row * tileSize, tileSize, tileSize);
};

export const createCanvas = (parent) => {
	const canvas = document.createElement("canvas");
	parent.appendChild(canvas);
	return canvas;
};

export const resizeCanvas = (canvas, board) => {
	canvas.setAttribute("width", board[0].length * tileSize);
	canvas.setAttribute("height", board.length * tileSize);
};
