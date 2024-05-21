import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [isTurnOfX, setIsTurnOfX] = useState(true);
  const [boardSize, setBoardSize] = useState(3);
  const [board, setBoard] = useState(createBoard(3));
  const [winner, setWinner] = useState(null);
  const [draw, setDraw] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0 });
    
  


  function createBoard(size) {
    // Create an empty array with a specified length (size)
    // Use the map function to iterate over each element of the empty array
    // Within the map function, for each element, execute the following:
    // Create a new array of a specified size
    //Use the fill method to fill the new array with zeros
    // Return the new row filled with zeros
    //  Return the matrix array created by mapping over the empty array with the amount with the value 
    let emptyArray = Array.from({ length: size });

    let row = emptyArray.map(() => {
        
        let newRow = Array(size);

        
        for (let i = 0; i < size; i++) {
            newRow[i] = 0;
        }

        return newRow;
    });

    return row;
}

useEffect(() => {
  const winner = checkWinner(board);
  if (winner) {
    setWinner(winner);
    setScore(score => ({ ...score, [winner]: score[winner] + 1 }));
  } else if (checkDraw(board)) {
    setDraw(true);
  }
}, [board])

  const checkWinner = (board) => {
    const size = board.length;

    // Check rows
    for (let i = 0; i < size; i++) {
      let rowWin = true;
      for (let j = 1; j < size; j++) {
        if (board[i][j] !== board[i][0] || board[i][0] === 0) {
          rowWin = false;
          break;
        }
      }
      if (rowWin) {
        return board[i][0];
      }
    }

    // Check columns
    for (let i = 0; i < size; i++) {
      let colWin = true;
      for (let j = 1; j < size; j++) {
        if (board[j][i] !== board[0][i] || board[0][i] === 0) {
          colWin = false;
          break;
        }
      }
      if (colWin) {
        return board[0][i];
      }
    }
    // Check diagonal (top-left to bottom-right)
    let diag1Win = true;
    for (let i = 1; i < size; i++) {
      if (board[i][i] !== board[0][0] || board[0][0] === 0) {
        diag1Win = false;
        break;
      }
    }
    if (diag1Win) {
      return board[0][0];
    }

    // Check diagonal (top-right to bottom-left)
    let diag2Win = true;
    for (let i = 1; i < size; i++) {
      if (board[i][size - i - 1] !== board[0][size - 1] || board[0][size - 1] === 0) {
        diag2Win = false;
        break;
      }
    }
    if (diag2Win) {
      return board[0][size - 1];
    }
    
    return null;
  };
  console.log(board)


  const checkDraw = (board) => {
    for (let row of board) {
      for (let cell of row) {
        if (cell === 0) {
          return false;
        }
      }
    }
    return true;
  };

  const resetBoard = () => {
    setBoard(createBoard(boardSize));
    setIsTurnOfX(true);
    setWinner(null);
    setDraw(false);
  };

  const selectBox = (e) => {
    if (winner || draw) return;

    const selectedBoxId = e.target.id;
    const row = Number(selectedBoxId.split('x')[0]);
    const column = Number(selectedBoxId.split('x')[1]);

    if (typeof board[row][column] === 'string') {
      return;
    }
    setBoard(board => {
      const newBoard = board.map(row => row.slice());
      newBoard[row][column] = isTurnOfX ? 'X' : 'O';
      setIsTurnOfX(!isTurnOfX);


      return newBoard;
    });
  };

  const handleBoardSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setBoardSize(newSize);
    setBoard(createBoard(newSize));
    setWinner(null);
    setDraw(false);
    setIsTurnOfX(true);
  };
  

  return (
    <div className="app">
      <div className="scoreboard">
        <div>Player X: {score.X}</div>
        <div>Player O: {score.O}</div>
      </div>
      <div className="turn">It's {isTurnOfX ? 'X' : 'O'} turn</div>
      <div>
        
        <label htmlFor="boardSize">Board Size: </label>
        
        <select id="boardSize" value={boardSize} onChange={handleBoardSizeChange}>
          <option value="3">3x3</option>
          <option value="4">4x4</option>
          <option value='5'> 5x5</option>
          <option value='6'> 6x6</option>
          
        </select>
      </div>
      <div className='board' style={{ gridTemplateColumns: `repeat(${boardSize}, 100px)` }}>
        {board.map((row, rowIndex) => {
          return row.map((selection, index) => {
            return (
              <div 
                className="box"
                onClick={selectBox}
                id={`${rowIndex}x${index}`} 
                key={`${rowIndex}x${index}`}
              >
                {typeof selection === 'string' && selection}
              </div>
            );
          });
        })}
      </div>
      {winner && <div className="winner">Winner: {winner}</div>}
      {draw && <div className="draw">It's a draw!</div>}
      <button onClick={resetBoard}>Reset</button>
    </div>
  );
}

export default App;
