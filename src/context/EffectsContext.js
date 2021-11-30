import React, { useContext, useState } from 'react'
import { CONSTANT } from '../Constant';

const EffectContext = React.createContext()

export function useShow() {
    return useContext(EffectContext)
}
export default function EffectProvider({ children }) {
    let cells = document.querySelectorAll('.board__cell')
    // let watchCell = document.getElementById('watch')
    let ms = 0, s = 0, m = 0
    // const [m, setm] = useState(0)
    // const [s, sets] = useState(0)
    let timer, watch

    const selectCell = (indexR, indexC) => {
        return document.getElementById(`cell-${indexR}-${indexC}`)
    }

    const hoverBg = (indexR, indexC, prev) => {
        for (let i = 0; i < 9; i++) {
            const cellR = selectCell(indexR, i)
            const cellC = selectCell(i, indexC)
            if (prev) {
                const prevR = selectCell(prev.row, i)
                const prevC = selectCell(i, prev.col)
                prevR.classList.remove('hover')
                prevC.classList.remove('hover')
            }
            cellR.classList.add('hover')
            cellC.classList.add('hover')
        }
    }

    const checkErr = (indexR, indexC, value) => {
        let box_row = indexR - indexR % 3, box_col = indexC - indexC % 3
        const addErr = (cell) => {
            if (cell.innerHTML == value) {
                cell.classList.add('err')
            }
        }
        for (let i = 0; i < 9; i++) {
            const cellR = selectCell(indexR, i)
            const cellC = selectCell(i, indexC)
            if (!cellR.classList.contains('selected')) addErr(cellR)
            if (!cellC.classList.contains('selected')) addErr(cellC)
        }
        for (let row = 0; row < CONSTANT.BOX_SIZE; row++) {
            for (let col = 0; col < CONSTANT.BOX_SIZE; col++) {
                const cellB = selectCell(row + box_row, col + box_col)
                console.log(row + box_row, col + box_col, cellB.innerHTML, value)
                if (cellB.innerHTML == value) {
                    cellB.classList.add('err')
                };
            }
        }
    }
    const removeErr = ({ row: indexR, col: indexC }) => {
        let box_row = indexR - indexR % 3, box_col = indexC - indexC % 3
        for (let i = 0; i < 9; i++) {
            const cellR = selectCell(indexR, i)
            const cellC = selectCell(i, indexC)
            const cell = selectCell(indexR, indexC)
            if (cellR.classList.contains('err') || cellC.classList.contains('err')) {
                cellR.classList.remove('err')
                cellC.classList.remove('err')
            }
            for (let row = 0; row < CONSTANT.BOX_SIZE; row++) {
                for (let col = 0; col < CONSTANT.BOX_SIZE; col++) {
                    const cellB = selectCell(row + box_row, col + box_col)
                    if (cellB.classList.contains('err')) {
                        cellB.classList.remove('err')
                    };
                }
            }
        }
        return false
    }
    const handleStart = () => {
        if (!timer) {
            timer = setInterval(run, 10)
        }
    }
    function run() {
        let watchCell = document.getElementById('watch')
        if (watchCell) {
            watchCell.textContent = (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s) + ":" + (ms < 10 ? "0" + ms : ms)
            ms++
            if (ms === 100) {
                ms = 0
                // sets(prev => prev + 1)
                s++
            }
            if (s === 60) {
                s = 0
                m++;
                // setm(prev => prev + 1)
            }
        }
    }
    const handlePause = () => {
        clearInterval(timer)
        timer = false
    }

    const value = {
        hoverBg,
        checkErr,
        removeErr,
        ms, s, m,
        timer, watch,
        handlePause,
        handleStart
    }
    return (
        <EffectContext.Provider value={value}>
            {children}
        </EffectContext.Provider>
    )
}
