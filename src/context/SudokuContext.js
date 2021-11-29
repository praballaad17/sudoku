import React, { useContext, useState } from 'react'
import { CONSTANT } from '../Constant';

const SudokuContext = React.createContext()

export function useSudoku() {
    return useContext(SudokuContext)
}
export default function SudokuProvider({ children }) {
    const [sudoku, setSudoku] = useState([
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ])
    const [puzzel, setPuzzel] = useState()
    const [question, setQuestion] = useState()
    const [name, setName] = useState("user")
    const [levelInx, setlevelinx] = useState(0)

    const newGrid = (size) => {
        let arr = new Array(size);

        for (let i = 0; i < size; i++) {
            arr[i] = new Array(size);
        }

        for (let i = 0; i < Math.pow(size, 2); i++) {
            arr[Math.floor(i / size)][i % size] = CONSTANT.UNASSIGNED;
        }
        return arr;
    }

    // check duplicate number in col
    const isColSafe = (grid, col, value) => {
        for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
            if (grid[row][col] === value) return false;
        }
        return true;
    }

    // check duplicate number in row
    const isRowSafe = (grid, row, value) => {
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
            if (grid[row][col] === value) return false;
        }
        return true;
    }

    // check duplicate number in 3x3 box
    const isBoxSafe = (grid, box_row, box_col, value) => {
        for (let row = 0; row < CONSTANT.BOX_SIZE; row++) {
            for (let col = 0; col < CONSTANT.BOX_SIZE; col++) {
                if (grid[row + box_row][col + box_col] === value) return false;
            }
        }
        return true;
    }

    // check in row, col and 3x3 box
    const isSafe = (grid, row, col, value) => {
        return isColSafe(grid, col, value) && isRowSafe(grid, row, value) && isBoxSafe(grid, row - row % 3, col - col % 3, value) && value !== CONSTANT.UNASSIGNED;
    }

    // find unassigned cell
    const findUnassignedPos = (grid, pos) => {
        for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
            for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
                if (grid[row][col] === CONSTANT.UNASSIGNED) {
                    pos.row = row;
                    pos.col = col;
                    return true;
                }
            }
        }
        return false;
    }

    const ispuzzelcom = () => {
        for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
            for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
                if (puzzel[row][col] === CONSTANT.UNASSIGNED) {
                    return false;
                }
            }
        }
        return true;
    }
    // shuffle arr
    const shuffleArray = (arr) => {
        let curr_index = arr.length;

        while (curr_index !== 0) {
            let rand_index = Math.floor(Math.random() * curr_index);
            curr_index -= 1;

            let temp = arr[curr_index];
            arr[curr_index] = arr[rand_index];
            arr[rand_index] = temp;
        }

        return arr;
    }

    // check puzzle is complete
    const isFullGrid = (grid) => {
        return grid.every((row, i) => {
            return row.every((value, j) => {
                return value !== CONSTANT.UNASSIGNED;
            });
        });
    }

    const sudokuCreate = (grid) => {
        let unassigned_pos = {
            row: -1,
            col: -1
        }

        if (!findUnassignedPos(grid, unassigned_pos)) return true;

        let number_list = shuffleArray([...CONSTANT.NUMBERS]);

        let row = unassigned_pos.row;
        let col = unassigned_pos.col;

        number_list.forEach((num, i) => {
            if (isSafe(grid, row, col, num)) {
                grid[row][col] = num;

                if (isFullGrid(grid)) {
                    return true;
                } else {
                    if (sudokuCreate(grid)) {
                        return true;
                    }
                }

                grid[row][col] = CONSTANT.UNASSIGNED;
            }
        });

        return isFullGrid(grid);
    }

    const sudokuCheck = (grid) => {
        let unassigned_pos = {
            row: -1,
            col: -1
        }

        if (!findUnassignedPos(grid, unassigned_pos)) return true;

        grid.forEach((row, i) => {
            row.forEach((num, j) => {
                if (isSafe(grid, i, j, num)) {
                    if (isFullGrid(grid)) {
                        return true;
                    } else {
                        if (sudokuCreate(grid)) {
                            return true;
                        }
                    }
                }
            })
        })

        return isFullGrid(grid);
    }

    const rand = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);

    const removeCells = (grid, level) => {
        let res = grid;

        let attemps = level;
        while (attemps > 0) {
            let row = rand();
            let col = rand();
            while (res[row][col] === 0) {
                row = rand();
                col = rand();
            }
            res[row][col] = CONSTANT.UNASSIGNED;
            attemps--;
        }
        setPuzzel(res)
        return res;
    }

    // generate sudoku base on level
    const sudokuGen = (level) => {

        let check = sudokuCreate(sudoku);
        let sucopy = []
        for (let i = 0; i < sudoku.length; i++) {
            sucopy[i] = sudoku[i].slice()
        }
        if (check) {
            let question = removeCells(sucopy, level);
            let qcopy = []
            for (let i = 0; i < question.length; i++) {
                qcopy[i] = question[i].slice()
            }
            setQuestion(qcopy)
        }
    }

    // console.log(puzzel, sudoku, question);
    const value = {
        sudokuCreate,
        sudokuGen,
        sudoku,
        setSudoku,
        name,
        setName,
        levelInx,
        setlevelinx,
        puzzel,
        setPuzzel,
        question,
        ispuzzelcom
    }
    return (
        <SudokuContext.Provider value={value}>
            {children}
        </SudokuContext.Provider>
    )
}
