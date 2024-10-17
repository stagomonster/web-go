const board = [];
const Stone = function(c, x, y) {
    this.color = c;
    this.x = x;
    this.y = y;
};

function initializeBoard() {
    for (let i = 0; i < 19; i++) {
        board[i] =  [];
        for (let j = 0; j < 19; j++) {
            board[i][j] = 0; //empty
        }
    }
}

function placeStone(s) {
    board[s.x][s.y] = s.color;
}

function isPlaceable(x,y) {
    if (x > 19 || y > 19 || x < 0 || y < 0 ||
    board[x][y] != 0) {
        return false;
    } //implement Ko rule too
    return true;
}

const renderBoard = () => {
    const boardElement = document.querySelector('.board');
    boardElement.innerHTML = '';

  // Loop through the 19x19 grid and create a square element for each space
    for (let i = 0; i < 19; i++) {
        for (let j = 0; j < 19; j++) {
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


};

const stones = document.querySelectorAll('.stone');
    stones.forEach((stone) => {
    stone.addEventListener('click', handleClick);
});


