const gb = document.getElementById('gameboard');


//          Make Board FF       \\
let gameboard = (function() {
    let board = [
        [' ', ' ', ' '],     // 0 1 2
        [' ', ' ', ' '],     // 1
        [' ', ' ', ' ']      // 2
    ];
    return {board}
})();





let gameplay = (function() {
    let currentPlayer;

    function startGame(){
        function initializePlayers(){
            players[0].piece = 'm';
            players[1].piece = 'O';
            currentPlayer = player1;
        }
        initializePlayers();
        makeMove(currentPlayer);
    }

    function makeMove() {
        console.log('making move')
        spots.forEach((spot) => {
            let [row, col] = spot.id.split(' ');
            spot.addEventListener('click', function() {
                 gameplay.checkMove(row, col);
            })
        })        
    }

    function checkMove(row, col){
        if (!!gameboard.board[row][col]) {
            gameboard.board[row][col] = this.piece || 'G';
            makeBoard.clearBoard();
            _checkWin();
        } else {
            console.log(`There is already a ${gameboard.board[row][col]} there.\nPick another spot`);
        }
    }

    function _checkWin() {
        if (false/* check win logic)*/) {

        } else {
            console.log('checked')
            //currentPlayer = (currentPlayer == player1)? player2 : player1;
            gameplay.makeMove();
        }

    }
    return {makeMove, startGame, checkMove}
})();


let players = [];
const player = (name) => {
    let piece;
    const makeMove = function(row, col) {
        gameplay.makeMove(row, col);
    }
    let score = 0;

    return {name, piece, score, makeMove}
}



let makeBoard = (function () {
    function createBoard(){
        let rowNum = 0;
        for (let row of gameboard.board) {
            let newRow = document.createElement('tr');
            let colNum = 0;
            for (let col of row) {
                let newDiv = document.createElement('td');
                newDiv.id = `${rowNum} ${colNum}`;
                newDiv.textContent = col + ' ';
                newRow.appendChild(newDiv);
                colNum = (colNum < 3)? colNum + 1 : 0;
            }
            rowNum++
            gb.appendChild(newRow);
        }
        spots = document.querySelectorAll('td'); //move
    }

    function clearBoard(){
        gb.textContent = '';
        makeBoard.createBoard();
    }

    return {createBoard, clearBoard,} 
})();



//      TESTS/INITS     \\
const player1 = player('player1');
const player2 = player('player2');
players.push(player1);
players.push(player2);

makeBoard.createBoard(); //move
 
gameplay.makeMove(); //testing


//      sampleplayer        //
const nima = player('nima');
nima.piece = 'G';