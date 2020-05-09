const gb = document.getElementById('gameboard');


//          Make Board FF       \\
let gameboard = (function() {
    let board = [
        ['', '', ''],     // 0 1 2
        ['', '', ''],     // 1
        ['', '', '']      // 2
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
        spots.forEach((spot) => {
            let [row, col] = spot.id.split(' ');
            spot.addEventListener('click', function() {
                checkMove(row, col);
            })
        })        
    }

    function checkMove(row, col){
        if (!!gameboard.board[row][col]) {
            console.log(`There is already a ${gameboard.board[row][col]} there.\nPick another spot`);
        } else {
            gameboard.board[row][col] = this.piece || 'G'; //sub G for player piece
            makeBoard.clearBoard();
            checkWin();
        }
    }

    function checkWin() {
        this.piece = 'G'; //sub G for player piece

        const checkStraight = () => {
            lines = []
            for (let j=0; j<3; j++) {
                let lineRow = [];
                let lineCol = [];
                for (let k=0; k<3; ++k) {
                    lineRow.push(gameboard.board[j][k]);
                    lineCol.push(gameboard.board[k][j]);
                }
                lines.push(lineRow, lineCol);
            }
            return lines.some(line => line.every(val => val == this.piece))
        }
        
        const checkDiag = () => {
            return (
                (this.piece == gameboard.board[0][0] && 
                this.piece == gameboard.board[1][1] &&
                this.piece == gameboard.board[2][2]
                ) ||
                (this.piece == gameboard.board[0][2] && 
                this.piece == gameboard.board[1][1] &&
                this.piece == gameboard.board[2][0]
                )
            )
        }

        if (checkDiag() || checkStraight()) {
            console.log('you won');
        } else {
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
                newDiv.textContent = col;
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