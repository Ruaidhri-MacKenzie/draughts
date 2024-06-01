const getPositionFromClick = (event, tileSize) => {
	const pixelX = event.clientX - event.target.offsetLeft;
	const pixelY = event.clientY - event.target.offsetTop;
	const column = (pixelX - (pixelX % tileSize)) / tileSize;
	const row = (pixelY - (pixelY % tileSize)) / tileSize;
	return { column, row };
};

export const onLeftClick = (canvas, tileSize, state, actionCallback, renderCallback) => (event) => {
	// Get column and row positions from click
	const position = getPositionFromClick(event, tileSize);
	actionCallback(state, position);
	renderCallback(canvas, state);
};

export const onRightClick = (canvas, tileSize, state, actionCallback, renderCallback) => (event) => {
	event.preventDefault();

	// Get column and row positions from click
	const position = getPositionFromClick(event, tileSize);
	actionCallback(state, position);
	renderCallback(canvas, state);
};
