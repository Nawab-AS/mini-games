const board = document.getElementById('board');
const statusDiv = document.getElementById('status');
const vsComputerCheckbox = document.getElementById('vsComputer');
const hardnessSelect = document.getElementById('hardness');
const hardnessContainer = document.getElementById('hardness-container');
let currentPlayer = 'X';
let gameActive = true;
const cells = Array.from(board.children);
let vsComputer = false;

if (vsComputerCheckbox) {
	vsComputerCheckbox.addEventListener('change', () => {
		vsComputer = vsComputerCheckbox.checked;
		hardnessContainer.style.display = vsComputer ? '' : 'none';
		resetGame();
	});
}

function checkWinner() {
	const winPatterns = [
		[0,1,2],[3,4,5],[6,7,8],
		[0,3,6],[1,4,7],[2,5,8],
		[0,4,8],[2,4,6]
	];
	for (const pattern of winPatterns) {
		const [a, b, c] = pattern;
		if (
			cells[a].textContent &&
			cells[a].textContent === cells[b].textContent &&
			cells[a].textContent === cells[c].textContent
		) {
			return cells[a].textContent;
		}
	}
	return null;
}

function checkDraw() {
	return cells.every(cell => cell.textContent);
}

function availableMoves() {
	return cells.map((cell, i) => cell.textContent ? null : i).filter(i => i !== null);
}

function makeMove(index, player) {
	cells[index].textContent = player;
}

function undoMove(index) {
	cells[index].textContent = '';
}

function minimax(isMax, depth, maxDepth) {
	const winner = checkWinner();
	if (winner === 'O') return {score: 10 - depth};
	if (winner === 'X') return {score: depth - 10};
	if (checkDraw()) return {score: 0};
	if (maxDepth !== undefined && depth >= maxDepth) return {score: 0};

	let bestMove = null;
	let bestScore = isMax ? -Infinity : Infinity;
	const player = isMax ? 'O' : 'X';
	for (const i of availableMoves()) {
		makeMove(i, player);
		const {score} = minimax(!isMax, depth + 1, maxDepth);
		undoMove(i);
		if (isMax) {
			if (score > bestScore) {
				bestScore = score;
				bestMove = i;
			}
		} else {
			if (score < bestScore) {
				bestScore = score;
				bestMove = i;
			}
		}
	}
	return {score: bestScore, move: bestMove};
}

function getAIMove() {
	const hardness = hardnessSelect ? hardnessSelect.value : 'hard';
	if (hardness === 'easy') {
		// Random move
		const moves = availableMoves();
		return moves[Math.floor(Math.random() * moves.length)];
	} else if (hardness === 'medium') {
		// 50% random, 50% minimax (depth-limited)
		if (Math.random() < 0.5) {
			const moves = availableMoves();
			return moves[Math.floor(Math.random() * moves.length)];
		} else {
			return minimax(true, 0, 2).move; // depth-limited minimax
		}
	} else {
		// Hard: full minimax
		return minimax(true, 0).move;
	}
}

function handleClick(e) {
	if (!gameActive || e.target.textContent) return;
	e.target.textContent = currentPlayer;
	const winner = checkWinner();
	if (winner) {
		statusDiv.textContent = `Player ${winner} wins!`;
		gameActive = false;
		cells.forEach(cell => cell.disabled = true);
		return;
	} else if (checkDraw()) {
		statusDiv.textContent = "It's a draw!";
		gameActive = false;
		return;
	}
	currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
	statusDiv.textContent = `Player ${currentPlayer}'s turn`;

	// If playing against computer and it's O's turn, let AI play
	if (vsComputer && gameActive && currentPlayer === 'O') {
		cells.forEach(cell => cell.disabled = true);
		setTimeout(() => {
			const aiMove = getAIMove();
			if (aiMove !== undefined) {
				cells[aiMove].textContent = 'O';
				const winner2 = checkWinner();
				if (winner2) {
					statusDiv.textContent = `Player ${winner2} wins!`;
					gameActive = false;
					cells.forEach(cell => cell.disabled = true);
				} else if (checkDraw()) {
					statusDiv.textContent = "It's a draw!";
					gameActive = false;
				} else {
					currentPlayer = 'X';
					statusDiv.textContent = `Player X's turn`;
					cells.forEach(cell => cell.disabled = false);
				}
			}
		}, 400);
	}
}

cells.forEach(cell => cell.addEventListener('click', handleClick));

function resetGame() {
	cells.forEach(cell => {
		cell.textContent = '';
		cell.disabled = false;
	});
	currentPlayer = 'X';
	gameActive = true;
	statusDiv.textContent = "Player X's turn";
	if (vsComputer && currentPlayer === 'O') {
		// If computer starts first (not default, but for future extension)
		const aiMove = getAIMove();
		if (aiMove !== undefined) {
			cells[aiMove].textContent = 'O';
			currentPlayer = 'X';
			statusDiv.textContent = `Player X's turn`;
		}
	}
}