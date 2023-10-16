import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare })  {
  return (
    <button
    className={`square ${isWinningSquare ? 'winning' : ''}`}
    onClick={onSquareClick}
  >
    {value}
  </button>
  );
}

function Board({ xIsNext, squares,winningSquares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares,i);
  }

  const winner = calculateWinner(squares);
  let status;
  
  if (winner!=null) {
    status = 'End game';
  } 
  else if (squares.every((square) => square !== null)) {
    status='It\'s a draw!';}
    else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
  <div className="status">{status}</div>
  {[0, 1, 2].map((rowIndex) => (
    <div className="board-row" key={rowIndex}>
      {[0, 1, 2].map((colIndex) => {
        const squareIndex = rowIndex * 3 + colIndex;
        const isWinningSquare = winner && winner.includes(squareIndex);
        return (
          <Square
            key={squareIndex}
            value={squares[squareIndex]}
            onSquareClick={() => handleClick(squareIndex)}
            isWinningSquare={isWinningSquare}
          />
        );
      })}
    </div>
  ))}
</>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{squares:Array(9).fill(null),row:null,col:null}]);
  const [currentMove, setCurrentMove] = useState(0);
  
  const [sortAscending, setSortAscending] = useState(true);

 
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares,index) {
    const nextHistory = [...history.slice(0, currentMove + 1), {squares: nextSquares, row:Math.floor(index / 3) + 1, col: (index % 3) + 1}] ;
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  const handleToggleSort = () => {
    setSortAscending(!sortAscending);
  };
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  
  const moves = history.map((squares, move) => {
    let description;
    if (move%2===0) {
      
    }
    if (move > 0) {
      if (move%2===0) {
        description = 'O Go to move #' + move+ ' ('+squares.row+','+squares.col+')';
      }
      else {
        description = 'X Go to move #' + move+ ' ('+squares.row+','+squares.col+')';
      }
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });
  const sortedMoves = sortAscending ? moves.slice().reverse() : moves;
  return (
    <div className="game">
       
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares.squares} onPlay={handlePlay} />
      </div>
      <button onClick={handleToggleSort}>
        {sortAscending ? 'Sort Descending' : 'Sort Ascending'}
      </button>

      <div className="game-info">
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}