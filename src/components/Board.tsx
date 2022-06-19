import React from "react";

const DEFAULT_BOARD = Array(9)
  .fill([])
  .map(() => Array(9).fill(""));

// TODO: move to worker
class Sudoku {
  board: string[][] | undefined;

  generate = (): string[][] => {
    const solvedBoard = this.generateSolvedBoard();
    const board = this.emptyBlocks(solvedBoard, 81 - 32);
    return board;
  };

  // TODO: rewrite with better solution such as rotate, suffuring, playing with matrix
  generateSolvedBoard = (): string[][] => {
    const randomBoard = JSON.parse(JSON.stringify(DEFAULT_BOARD));

    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      randomBoard[row][col] = num.toString();
    });

    const board = this.solveSudoku(randomBoard);
    return board;
  };

  // TODO: refactor to functional way
  emptyBlocks = (solvedBoard: string[][], hideBlock: number) => {
    const board: string[][] = JSON.parse(JSON.stringify(solvedBoard));

    const countEmptyCoordinate = () =>
      board.reduce((count, row) => count + row.filter(Boolean).length, 0);

    const getEmptyCoordinate = (): { row: number; col: number } => {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      return board[row][col] ? { row, col } : getEmptyCoordinate();
    };

    do {
      const { row, col } = getEmptyCoordinate();
      board[row][col] = "";
    } while (9 * 9 - hideBlock < countEmptyCoordinate());

    return board;
  };

  solveSudoku = (board: string[][]) => {
    this.board = board;
    this.doSolve(this.board, 0, 0);

    return this.board;
  };

  // TODO: refactor to functional way
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

      const boxRow = block_row + Math.floor(i / 3);
      const boxCol = block_col + (i % 3);
      const boxExist = board[boxRow][boxCol] == num;

      if (columnExist || rowExist || boxExist) return false;
    }

    return true;
  }
}

const sudoku = new Sudoku();

const Board = () => {
  // TODO: freeze block when generate, allow only empty block
  const [board, setBoard] = React.useState<string[][]>(sudoku.generate());

  const onSolve = () => {
    const solvedBoard = sudoku.solveSudoku(board);
    setBoard(JSON.parse(JSON.stringify(solvedBoard)));
  };

  // TODO: real-time validate
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
