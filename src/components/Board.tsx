import React from "react";

const DEFAULT_BOARD = [
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
];

class Sudoku {
  board: string[][] | undefined;

  solveSudoku = (board: string[][]) => {
    this.board = board;
    this.doSolve(this.board, 0, 0);

    return this.board;
  };

  doSolve(board: string[][], row: number, col: number) {
    for (let i = row; i < 9; i++, col = 0) {
      for (let j = col; j < 9; j++) {
        if (board[i][j] != "") continue;

        for (let num = 1; num <= 9; num++) {
          if (this.isValid(board, i, j, num.toString())) {
            board[i][j] = num.toString();
            if (this.doSolve(board, i, j + 1)) return true;
            board[i][j] = "";
          }
        }
        return false;
      }
    }
    return true;
  }

  isValid(board: string[][], row: number, col: number, num: string) {
    let block_row = Math.floor(row / 3) * 3;
    let block_col = Math.floor(col / 3) * 3; // Block no. is i/3, first element is i/3*3

    for (let i = 0; i < 9; i++) {
      const columnExist = board[i][col] == num;
      const rowExist = board[row][i] == num;

      const zoneRow = block_row + Math.floor(i / 3);
      const zoneCol = block_col + (i % 3);
      const zoneExist = board[zoneRow][zoneCol] == num;

      if (columnExist || rowExist || zoneExist) return false;
    }

    return true;
  }
}

const sudoku = new Sudoku();

const Board = () => {
  const [board, setBoard] = React.useState<string[][]>(DEFAULT_BOARD);

  const onSolve = () => {
    const solvedBoard = sudoku.solveSudoku(board);
    setBoard(JSON.parse(JSON.stringify(solvedBoard)));
  };

  const setBlock =
    (row: number, col: number) =>
    ({ target: { value } }: any) => {
      let newBoard = JSON.parse(JSON.stringify(board));
      newBoard[row][col] = value;
      setBoard(newBoard);
    };

  return (
    <div className="px-4 pt-4">
      {board.map((row, rIndex) => (
        <div key={rIndex} className="flex justify-center group">
          {row.map((col, cIndex) => (
            <div key={cIndex} className="block">
              <input
                type="text"
                className="w-full text-center outline-none"
                // placeholder="1"
                value={col}
                onChange={setBlock(rIndex, cIndex)}
              />
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-center">
        <button className="p-2 m-4 rounded bg-slate-200" onClick={onSolve}>
          Solve!
        </button>
      </div>
    </div>
  );
};

export default Board;
