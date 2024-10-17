const board = [];
let visited = [];

const ROW_SQUARES = 19;
const COL_SQUARES = 19;

const E = 0;
const B = 1;
const W = 2;

let currentPlayer = B; // 1 or 2 B or W

const zobristHash = [];
let lastHash = 0;
const hashes = [];

const Stone = function(c, x, y) {
    this.color = c;
    this.x = x;
    this.y = y;
};

function initializeBoard() {
    for (let i = 0; i < ROW_SQUARES; i++) {
        board[i] =  [];
        for (let j = 0; j < COL_SQUARES; j++) {
            board[i][j] = E; //empty
        }
    }
}

function placeStone(s) {
    board[s.x][s.y] = s.color;
}

function isPlaceable(x,y) {
    if (x > ROW_SQUARES || y > COL_SQUARES || x < 0 || y < 0 ||
    board[x][y] != E) {
        return false;
    } //implement Ko rule too
    return true;
}

const renderBoard = () => {
    const boardElement = document.querySelector('.board');
    boardElement.innerHTML = '';

  // Loop through the 19x19 grid and create a square element for each space
    for (let i = 0; i < ROW_SQUARES; i++) {
        for (let j = 0; j < COL_SQUARES; j++) {
        const squareElement = document.createElement('div');
        squareElement.className = 'square';
        squareElement.dataset.x = i; // Add data-x attribute
        squareElement.dataset.y = j; // Add data-y attribute

        squareElement.addEventListener('click', click);

        // Add the square element to the board element
        boardElement.appendChild(squareElement);
        }
    }
}


const click = (event) => {
    const square = event.target;
    const x = square.dataset.x;
    const y = square.dataset.y;

    if (isPlaceable(x,y)) {
        const Stone = new Stone(currentPlayer, x, y)
        placeStone(stone);
        square.className = `square ${currentPlayer == 1? 'black' : 'white'}`;
        currentPlayer = (currentPlayer == B)? W : B;

        let numCaptures = 0;
        captures = check_captures(3-currentPlayer);
        for (int r = 0; r < captures.length; r++) {
            for (int c = 0; c < captures[0].length; c++) {
                if (captures[r][c] == 1) {
                    numCaptures += 1;
                }
            }
        }
    }

};

function floodFill(x,y, color) { // return true if alive, false if captured
    if(visited[x][y] == 1) {
        return false;
    } else {
        visited[x][y] = 1;
    }

    if (x > ROW_SQUARES || y > COL_SQUARES || x < 0 || y < 0) {
        return;
    }
    if (board[x][y] == E) {
        return true;
    }
    if (board[x][y] != color) {
        return false;
    }

    live = x > 0 and floodFill(x - 1, y, color);
    live|= x < ROW_SQUARES - 1 and floodFill(x + 1, y, color);
    live|= y > 0 and floodFill(x, y - 1, color);
    live|= y < COL_SQUARES - 1 and floodFill(x, y + 1, color);
    return live;
}

function checkCaptures(color) {
    let removed = [];
    for (int r = 0; r < ROW_SQUARES; r++) {
        for (int c = 0; c < COL_SQUARES; c++) {
            if (board[r][c] == color) {
                visited = [];
                if (!floodFill(color)) { //Group is not alive
                    removed[r][c] = 1;
                }
            }
        }
    }
    return removed;
}

function initializeZobristTable() {
    const board = Array.from({ length: 2 }, () =>
        Array.from({ length: ROW_SQUARES }, () =>
            Array.from({ length: COL_SQUARES }, () =>
                Math.floor(Math.random() * (2 ** 64 - 1)) + 1
            )
        )
    );
    return board;
}

function add_hash_one(ap, add_pos, hash_){
    let add_piece = ap - 1; // to fit into (1, 2^64 -1) threshold

    let h = hash_ ^ zobrist[add_pos[0]][add_pos[1]][add_piece]
    return h;
}



initializeBoard();
zobristHash = initializeZobristTable();
renderBoard();




