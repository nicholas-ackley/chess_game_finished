document.addEventListener('DOMContentLoaded', () => {
    let board = null; // Initialize the chessboard
    const game = new Chess(); // Create new Chess.js game instance
    const moveHistory = document.getElementById('move-history'); // Get move history container
    const messageContainer = document.getElementById('message'); // Message container for GIFs
    let moveCount = 1; // Initialize the move count
    let userColor = 'w'; // Initialize the user's color as white

    // Function to display a GIF or image
    const displayGif = (imageUrl, message) => {
        messageContainer.innerHTML = `
            <div style="text-align: center; margin-top: 20px;">
                <p>${message}</p>
                <img src="${imageUrl}" alt="Game Result" style="max-width: 300px; border-radius: 10px;">
            </div>
        `;
    };

    // Function to check for game status and show appropriate image
    const checkGameStatus = () => {
        if (game.in_checkmate()) {
            if (game.turn() === userColor) {
                // User lost (Levy Rozman)
                displayGif('levi.jpg', "You Lost! GothamChess is watching...");
            } else {
                // User won (Magnus Carlsen)
                displayGif('magnus.gif', "You Won! Magnus Carlsen approves!");
            }
        }
    };

    // Function to make a random move for the computer
    const makeRandomMove = () => {
        if (game.game_over()) {
            checkGameStatus();
            return;
        }

        const possibleMoves = game.moves();
        const randomIdx = Math.floor(Math.random() * possibleMoves.length);
        const move = possibleMoves[randomIdx];
        game.move(move);
        board.position(game.fen());
        recordMove(move, moveCount);
        moveCount++;

        checkGameStatus();
    };

    // Function to record and display moves
    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight;
    };

    // Function to handle a piece drop
    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q',
        });

        if (move === null) return 'snapback';

        recordMove(move.san, moveCount);
        moveCount++;
        window.setTimeout(makeRandomMove, 250);
        checkGameStatus();
    };

    // Chessboard configuration
    const boardConfig = {
        draggable: true,
        position: 'start',
        onDrop,
        onSnapEnd: () => board.position(game.fen()),
        onDragStart: (source, piece) => !game.game_over() && piece.search(userColor) === 0,
    };

    // Initialize the board
    board = Chessboard('board', boardConfig);

    // Event listener for "Play Again"
    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.textContent = '';
        messageContainer.innerHTML = '';
        moveCount = 1;
        userColor = 'w';
    });

    // Event listener for "Set Position"
    document.querySelector('.set-pos').addEventListener('click', () => {
        const fen = prompt("Enter the FEN notation for the desired position!");
        if (fen !== null && game.load(fen)) {
            board.position(fen);
            moveHistory.textContent = '';
            messageContainer.innerHTML = '';
            moveCount = 1;
        } else {
            alert("Invalid FEN notation. Please try again.");
        }
    });

    // Event listener for "Flip Board"
    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip();
        userColor = userColor === 'w' ? 'b' : 'w';
    });
});
