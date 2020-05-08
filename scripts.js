const gb = document.getElementById('gameboard');

let gameboard = (function() {
    let board = [
        ['x', 'o', 'x'],     // 0 1 2
        ['x', 'o', 'o'],     // 1
        ['o', 'o', 'x']      // 2
    ];

    function makeMove (row, col, piece){
        if (!this.board[row][col]) {
            this.board[row][col] = piece;
            displayBoard();
            _checkWin();
        } else {
            console.log(`There is already a ${this.board[row][col]} there.\nPick another spot`);
        }
    }

    function _checkWin() {

    }
    return {board, makeMove}
})();


const player = (num) => {
    let name = `Player${num}`;
    let score = 0;
    return {name, score}
}


function displayBoard() {
    for (let row of gameboard.board) {
        let newRow = document.createElement('tr');
        for (let col of row) {
            newRow.textContent += col + ' ';
        }
        gb.appendChild(newRow);
    }
}

displayBoard();
