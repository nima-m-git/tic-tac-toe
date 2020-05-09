const gb = document.getElementById('gameboard');


//          Make Board FF       \\
let gameboard = (function() {
    let board = generateNewBoard();

    function generateNewBoard() {
        return [
            ['', '', ''],     // 0 1 2
            ['', '', ''],     // 1
            ['', '', '']      // 2
        ];
    }

    function displayBoard() {
        newTable = document.createElement('table');
        let rowNum = 0;
        for (let row of board) {
            let newRow = document.createElement('tr');
            let colNum = 0;
            for (let block of row) {
                let newCell = document.createElement('td');
                newCell.id = `${rowNum} ${colNum}`;
                newCell.textContent = block;
                newRow.appendChild(newCell);
                colNum = (colNum < 3)? colNum + 1 : 0;
            }
            rowNum++
            newTable.appendChild(newRow);
            gb.appendChild(newTable);
        }
        spots = document.querySelectorAll('td'); // remove from global namespace
    }

    function clearBoard() {
        gb.removeChild(newTable); // removes DOM table
        displayBoard();
    }

    function resetBoard() {
        // iteration resets js board
        for (let i=0; i<3; i++){
            for (let c=0; c<3; c++) {
                gameboard.board[i][c] = '';
            }
        }
        clearBoard();
    }

    return {board, displayBoard, clearBoard, generateNewBoard, resetBoard,} 
})();



let gameplay = (function() {
    function startGame(){
        player1 = players[0];
        player2 = players[1];
        players[0].piece = 'X';
        players[1].piece = 'O';
        currentPlayer = player1;

        currentPlayer.makeMove();
    }

    function checkMove(row, col){
        if (!!gameboard.board[row][col]) {
            console.log(`There is already a ${gameboard.board[row][col]} there.\nPick another spot`);
        } else {
            gameboard.board[row][col] = currentPlayer.piece; 
            gameboard.clearBoard();
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
            currentPlayer.score += 1;
            console.log([player1.name, player1.score], [player2.name, player2.score]) // updatescore()
        } else {
            currentPlayer = (currentPlayer == player1)? player2 : player1;
            currentPlayer.makeMove();
        }

    }
    return {startGame, checkMove}
})();


let players = [];
const player = (name) => {
    let score = 0;

    const makeMove = function makeMove() {
        spots.forEach((spot) => {  //remove spots from global
            let [row, col] = spot.id.split(' ');
            spot.addEventListener('click', function() {
                gameplay.checkMove(row, col);
            })
        })        
    }


    return {name, score, makeMove}
}



//      TESTS/INITS     \\
gameboard.displayBoard(); //move

const nima = player('nima');
const joe = player('joe');
players.push(nima);
players.push(joe);



//      sampleplayer        //
