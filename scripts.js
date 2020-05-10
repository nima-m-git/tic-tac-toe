const gb = document.getElementById('gameboard');
const playerDisplay = document.getElementById('players');
const player1Screen = document.getElementById('player1Screen');
const player2Screen = document.getElementById('player2Screen');
const currentPlayerScreen = document.getElementById('currentPlayerScreen');
const winnerScreen = document.getElementById('winnerScreen');
const messageScreen = document.getElementById('messageScreen');
const resetButton = document.getElementById('reset');


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
        messageScreen.textContent = '';
        spots = document.querySelectorAll('td'); // remove from global namespace
    }

    function clearBoard() {
        gb.removeChild(newTable); // removes DOM board
        displayBoard();
    }

    function resetBoard() {
        // resets js board
        for (let i=0; i<3; i++){
            for (let c=0; c<3; c++) {
                gameboard.board[i][c] = '';
            }
        }
        clearBoard();
        winnerScreen.textContent = '';
    }

    return {board, displayBoard, clearBoard, generateNewBoard, resetBoard,} 
})();


//          Gameplay            \\
let currentPlayer;

let gameplay = (function() {

    function startGame(){
        gameboard.resetBoard();
        player1.piece = (player1.piece == 'O')? 'X' : 'O';
        player2.piece = (player2.piece == 'X')? 'O' : 'X';
        currentPlayer = (!currentPlayer || currentPlayer == player2)? player1 : player2;
        players.updatePlayerScreen();
        currentPlayer.makeMove();
    }

    function checkMove(row, col){
        if (!!gameboard.board[row][col]) {
            messageScreen.textContent = `There is already a ${gameboard.board[row][col]} there ${currentPlayer.name}!\nPick another spot`;
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
            currentPlayer.score += 1;
            winnerScreen.textContent = `${currentPlayer.name} won!`;
        } else {
            currentPlayer = (currentPlayer == player1)? player2 : player1;
            currentPlayer.makeMove();
        }
        players.updatePlayerScreen();
    }
    return {startGame, checkMove,}
})();


//          Players         \\

let players = (function() {
    const player = (name, computer=false) => {
        let score = 0;
        const makeMove = () => {
            if (!computer) {
                spots.forEach((spot) => {  //remove spots from global
                    let [row, col] = spot.id.split(' ');
                    spot.addEventListener('click', function() {
                        gameplay.checkMove(row, col);
                    })
                }) 
            } else {
                let availSpots = [];
                spots.forEach((spot) => {
                    let [row, col] = spot.id.split(' ');
                    if (!spot.textContent) {
                        availSpots.push([row, col]);
                    }
                })
                let randomSpot = availSpots[(Math.floor(Math.random() * availSpots.length))];
                let [row, col] = randomSpot;
                gameplay.checkMove(row, col);
            }
                   
        }
        return {name, score, makeMove,}
    }

    const playerChoice = (choice) => {
        player1 = player(prompt('Enter first player\'s name') || 'player1');
        player2 = (choice == 'human')? player(prompt('Enter second player\'s name') || 'player2') :
            player('Computer', computer=true);
        resetButton.textContent = 'Reset';
    }

    const updatePlayerScreen = () => {
        player1Screen.textContent = `Player: ${player1.name} Piece: ${player1.piece} Score: ${player1.score}`;
        player2Screen.textContent = `Player: ${player2.name} Piece: ${player2.piece} Score: ${player2.score}`;
        currentPlayerScreen.textContent = `Current Player: ${currentPlayer.name}`;
    }
    
    return {player, playerChoice, updatePlayerScreen, }
})();





//      TESTS/INITS     \\
gameboard.displayBoard(); //move



