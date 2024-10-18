const board = [];

const ROW_SQUARES = 19;
const COL_SQUARES = 19;

let visited = new Array(ROW_SQUARES).fill(0).map(() => new Array(COL_SQUARES).fill(0));

const E = 0;
const B = 1;
const W = 2;

let whiteCaptures = 0;
let blackCaptures = 0;

let currentPlayer = B; // 1 or 2 B or W

let zobristHash = [];
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
    let square = document.getElementById(`square-${s.x}-${s.y}`);
    square.className = `square ${s.color === B? 'black' : 'white'}`;
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


        squareElement.style.gridColumnStart = j + 1;
        squareElement.style.gridColumnEnd = j + 2;
        squareElement.style.gridRowStart = i + 1;
        squareElement.style.gridRowEnd = i + 2;
        squareElement.id = `square-${i}-${j}`;

        if (board[i][j] == B) {
            squareElement.innerHTML = '<img src = "black_stone.png" alt = "Black Stone"/>';

        } else if (board[i][j] == W) {
            squareElement.innerHTML = '<img src="white_stone.png" alt="White Stone"/>';
        } else {
            squareElement.innerHTML = '';
        }
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
        let h = 0; //current hash
        let stone = new Stone(currentPlayer, x, y)
        placeStone(stone);
        square.className = `square ${currentPlayer == 1? 'black' : 'white'}`;
        currentPlayer = (currentPlayer == B)? W : B;

        let numCaptures = 0;
        let captures = checkCaptures(currentPlayer);
        for (let r = 0; r < ROW_SQUARES; r++) {
            for (let c = 0; c < COL_SQUARES; c++) {
                if (captures[r][c] == 1){
                    board[r][c] = E;
                    numCaptures += 1;
                }
            }
        }
        if (numCaptures == 0) {
            h = addHashOne(3-currentPlayer, [x,y], lastHash);
        } else {
            h = addHashOne(3-currentPlayer,[x,y], lastHash);
            h = removeHash(currentPlayer, captures, h);
        }

        possibleCaptures = checkCaptures(3-currentPlayer);

        if(checkHash(h) || possibleCaptures.some(sublist => sublist.includes(1)) ) {
            //KO
            for (let r = 0; r < ROW_SQUARES; r++) {
                for (let c = 0; c < COL_SQUARES; c++) {
                    if (captures[r][c] == 1) {
                        board[r][c] = currentPlayer;
                    }
                }
            }
            board[x][y] = E;
            h = lastHash;
            currentPlayer = 3-currentPlayer;
            hashes.push(h);
        } else {
            hashes.push(h);
            lastHash = h;

            if (currentPlayer == B) {
                whiteCaptures += captures;
            } else {
                blackCaptures += captures;
            }
        }

    }

};

function floodFill(x, y, color) { // return true if alive, false if captured
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

    live = x > 0 && floodFill(x - 1, y, color);
    live = live || (x < ROW_SQUARES - 1 && floodFill(x + 1, y, color));
    live = live || (y > 0 && floodFill(x, y - 1, color));
    live = live || (y < COL_SQUARES - 1 && floodFill(x, y + 1, color));
    return live;
}

function checkCaptures(color) {
    let removed = new Array(ROW_SQUARES).fill(0).map(() => new Array(COL_SQUARES).fill(0));
    for (let r = 0; r < ROW_SQUARES; r++) {
        for (let c = 0; c < COL_SQUARES; c++) {
            if (board[r][c] == color) {
                visited = new Array(ROW_SQUARES).fill(0).map(() => new Array(COL_SQUARES).fill(0));
                if (!floodFill(r, c, color)) { //Group is not alive
                    removed[r][c] = 1;
                }
            }
        }
    }
    return removed;
}

function initializeZobristTable() {
    const board = Array.from({ length: ROW_SQUARES }, () =>
                    Array.from({ length: COL_SQUARES }, () =>
                        Array.from({ length: 2 }, () =>
                            Math.floor(Math.random() * (Math.pow(2, 64) - 1)) + 1
                        )
                    )
                );
    return board;
}

function checkHash(h) {
    return h in hashes;
}

function addHashOne(ap, addPos, hash_){
    let addPiece = ap - 1; // to fit into (1, 2^64 -1) threshold

    let h = hash_ ^ zobristHash[addPos[0]][addPos[1]][addPiece]
    return h;
}

function removeHash(rp, removePos, hash_) {
    let removePiece = rp - 1;
    let h = hash_;
    for (let r = 0; r < ROW_SQUARES; r++) {
        for (let c = 0; c < COL_SQUARES; c++) {
            if (removePos[r][c] != 0) {
                h = h ^ zobristHash[r][c][removePiece];
            }
        }
    }
    return h;
}


console.log("test");
initializeBoard();
zobristHash = initializeZobristTable();
renderBoard();




