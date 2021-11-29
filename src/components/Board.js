import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useSudoku } from '../context/SudokuContext'
import { useShow } from '../context/EffectsContext'
import { CONSTANT, ROUTE } from '../Constant'
import Watch from './Watch'

export default function Board() {
    const [toggle, settoggle] = useState(false)
    const [com, setCom] = useState(false)
    const [selected, setSelected] = useState({
        row: -1, col: -1
    })
    const { sudoku, name, levelInx, puzzel, setPuzzel, question, ispuzzelcom, } = useSudoku()
    const { hoverBg, checkErr, removeErr, handleStart, m, s, ms, handlePause } = useShow()



    const handleSelect = (indexR, indexC) => {
        if (indexC !== selected.col || indexR !== selected.row) {
            if (selected.col !== -1 && selected.row !== -1) {
                const prevcell = document.getElementById(`cell-${selected.row}-${selected.col}`)
                prevcell.classList.remove('selected')
                hoverBg(indexR, indexC, selected)
                removeErr(selected)
            }
            else hoverBg(indexR, indexC)
            const cell = document.getElementById(`cell-${indexR}-${indexC}`)
            cell.classList.add('selected')
            // hoverBg(indexR, indexC)
            setSelected({ row: indexR, col: indexC })
        }
        else {
            console.log("same cell");
        }
    }

    const handleEdit = (num) => {
        if (selected.col !== -1 && selected.row !== -1) {
            const copy = [...puzzel]
            copy[selected.col][selected.row] = num
            setPuzzel(copy);
            removeErr(selected)
            checkErr(selected.row, selected.col, num)
            console.log(ispuzzelcom());
            if (ispuzzelcom()) {
                setCom(true)
                handlePause()
            }
        }
    }

    const handleClear = () => {
        if (selected.col !== -1 && selected.row !== -1) {
            const copy = [...puzzel]
            copy[selected.col][selected.row] = CONSTANT.UNASSIGNED
            setPuzzel(copy);
            removeErr(selected)
        }
    }

    const handleHint = () => {
        if (selected.col !== -1 && selected.row !== -1) {
            const copy = [...puzzel]
            copy[selected.col][selected.row] = sudoku[selected.col][selected.row]
            setPuzzel(copy);
            removeErr(selected)
            if (ispuzzelcom()) {
                setCom(true)
                handlePause()
            }
        }
    }
    return (

        <div className="board">
            <div className="details">
                <div className="details__top">
                    <div className="details__name">{name}</div>
                    <div className="details__level">{CONSTANT.LEVEL_NAME[levelInx]}</div>
                    <div onClick={handleHint} className="details__hint">Hint</div>
                </div>
                <div className="details__bottom">
                    <Watch open={() => settoggle(true)} />
                </div>
            </div>
            <div className="board__main">
                {puzzel.map((row, indexC) => (
                    <div key={indexC} className="board__row" >
                        {row.map((item, indexR) => (
                            <>
                                {/* <div key={indexR} id={`cell-${indexR}-${indexC}`} className={`board__cell ${question[indexC][indexR] !== CONSTANT.UNASSIGNED ? "filled" : ""}`}>{item}</div> */}

                                {question[indexC][indexR] !== CONSTANT.UNASSIGNED ?
                                    <div key={indexR} id={`cell-${indexR}-${indexC}`} className={`board__cell ${question[indexC][indexR] !== CONSTANT.UNASSIGNED ? "filled" : ""}`}>
                                        {item ? item : ""}</div>
                                    :
                                    <div key={indexR} id={`cell-${indexR}-${indexC}`} onClick={() => handleSelect(indexR, indexC)
                                    }
                                        className="board__cell">{item ? item : ""}</div>
                                }
                            </>))}
                    </div>
                ))}
            </div>
            {toggle && <div className="board__overlay">
                <div className="board__overlay-btn" onClick={() => { settoggle(false); handleStart() }}>Resume</div>
                <div onClick={() => window.location = ROUTE.ROOT} className="board__overlay-btn">New Game</div>
            </div>}
            {com && <div className="board__overlay">
                <div>Congratulations! You Win</div>
                <div className="board__overlay-btn">{document.getElementById('watch').innerHTML}</div>
                <div onClick={() => window.location = ROUTE.ROOT} className="board__overlay-btn">New Game</div>
            </div>}
            <div className="pad">
                <div className="padnum-top">
                    {CONSTANT.NUMBERS.map(num => (num < 6 ? <div key={num} className="padnum" onClick={() => handleEdit(num)}>
                        {num} </div> : <></>))}
                </div>
                <div className="padnum-bottom">
                    {CONSTANT.NUMBERS.map(num => (num > 5 ? <div key={num} className="padnum" onClick={() => handleEdit(num)}>
                        {num}
                    </div> : <></>
                    ))}
                    <div className="padnum-cross" onClick={handleClear}><i className="fas fa-times"></i></div>
                </div>
            </div>

        </div>
    )
}
