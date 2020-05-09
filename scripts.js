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
            player1 = players[0];
            player2 = players[1];
            players[0].piece = 'X';
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
            gameboard.board[row][col] = currentPlayer.piece; 
            makeBoard.clearBoard();
            checkWin();
        }
    }

    function checkWin() {

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
            return lines.some(line => line.every(val => val == currentPlayer.piece))
        }
        
        const checkDiag = () => {
            return (
                (currentPlayer.piece == gameboard.board[0][0] && 
                currentPlayer.piece == gameboard.board[1][1] &&
                currentPlayer.piece == gameboard.board[2][2]
                ) ||
                (currentPlayer.piece == gameboard.board[0][2] && 
                currentPlayer.piece == gameboard.board[1][1] &&
                currentPlayer.piece == gameboard.board[2][0]
                )
            )
        }

        if (checkDiag() || checkStraight()) {
            console.log(`${currentPlayer.name} won!`);
            console.log(currentPlayer)
            currentPlayer.score += 1;
            console.log(currentPlayer)
        } else {
            currentPlayer = (currentPlayer == player1)? player2 : player1;
            gameplay.makeMove();
        }

    }
    return {makeMove, startGame}
})();


let players = [];
const player = (name) => {
    const makeMove = function(row, col) {
        gameplay.makeMove(row, col);
    }
    let score = 0;

    return {name, score, makeMove}
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
const nima = player('nima');
const joe = player('joe');
players.push(nima);
players.push(joe);

makeBoard.createBoard(); //move
 
gameplay.startGame(); //testing


//      sampleplayer        //
