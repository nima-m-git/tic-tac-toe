const gb = document.getElementById('gameboard');
const playerDisplay = document.getElementById('players');
const player1Screen = document.getElementById('player1Screen');
const player2Screen = document.getElementById('player2Screen');
const currentPlayerScreen = document.getElementById('currentPlayerScreen');
const currentPieceScreen = document.getElementById('currentPieceScreen');
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

    function winimation() {
        winnerScreen.textContent = `${currentPlayer.name} won!`;

        function toggle() {
            spots.forEach((piece) => {
            piece.classList.toggle('pieceFlash');
            })
            gb.classList.toggle('spin');
        };
        toggle();

        setTimeout(function() {
            toggle();
        }, 5000);

        winnerScreen.classList.toggle('flash');
        setTimeout(function() {winnerScreen.classList.toggle('flash');}, 20000);
    }

    return {board, displayBoard, clearBoard, generateNewBoard, resetBoard, winimation} 
})();


//          Gameplay            \\
let currentPlayer;

let gameplay = (function() {

    function startGame(){
        gameboard.resetBoard();
        player1.piece = (player1.piece == 'X')? 'O' : 'X';
        player2.piece = (player2.piece == 'O')? 'X' : 'O';
        currentPlayer = (!currentPlayer || currentPlayer == player2)? player1 : player2;
        players.updatePlayerScreen();
        currentPlayer.makeMove();
        resetButton.style.display = '';
    }

    function checkMove(row, col){
        if (!!gameboard.board[row][col]) {
            messageScreen.textContent = `There is already an ${gameboard.board[row][col]} there ${currentPlayer.name}!\nPick another spot`;
        } else {
            gameboard.board[row][col] = currentPlayer.piece; 
            gameboard.clearBoard();
            checkWin();
        }
    }

    function checkTie() {
        const spotFilled = (spot) => (spot.textContent == 'X' || spot.textContent == 'O');
        return Array.from(spots).every(spotFilled)
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
            gameboard.winimation();
        } else if (checkTie()) {
            winnerScreen.textContent = 'Draw!'
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
                setTimeout(function() {
                    gameplay.checkMove(row, col)
                }, 1000);
            }
                   
        }
        return {name, score, makeMove,}
    }

    const playerChoice = (choice) => {
        player1 = player(prompt('Enter first player\'s name') || 'player1');
        player2 = (choice == 'human')? player(prompt('Enter second player\'s name') || 'player2') :
            player('Computer', computer=true);
        resetButton.textContent = 'Reset';
        gameplay.startGame();
    }

    const updatePlayerScreen = () => {
        player1Screen.textContent = `${player1.name} Score: ${player1.score}`;
        player2Screen.textContent = `${player2.name} Score: ${player2.score}`;
        currentPlayerScreen.textContent = `Current Player: ${currentPlayer.name}`;
        currentPieceScreen.textContent = `Piece: ${currentPlayer.piece}`;
    }
    
    return {player, playerChoice, updatePlayerScreen, }
})();





//      TESTS/INITS     \\
gameboard.displayBoard(); //move

// player1 = players.player('nima');
// player2 = players.player('computer', computer=true);
// resetButton.textContent = 'Reset';

// gameplay.startGame();

