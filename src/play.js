export const isPlayerOneTurn = (state) => {
	return state.currentPlayer === 1;
};

export const isPlayerTwoTurn = (state) => {
	return state.currentPlayer === -1;
};

export const swapPlayers = (state) => {
	// Switch between Player One and Player Two
	state.currentPlayer *= -1;
};
