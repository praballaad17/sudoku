import React, { useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { CONSTANT, ROUTE } from '../Constant'
import { useShow } from '../context/EffectsContext'
import { useSudoku } from '../context/SudokuContext'

export default function Start() {
    const { sudokuGen, setSudoku, setName, setlevelinx, levelInx } = useSudoku()
    const history = useHistory()
    const { handleStart } = useShow()

    const handleSubmit = (e) => {
        e.preventDefault()
        const level = CONSTANT.LEVEL[levelInx]
        sudokuGen(level)
        handleStart()
        history.push(ROUTE.BOARD)
    }

    return (
        <div className="start">
            <Form className="start__form" >
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className="fw-bold text-uppercase" style={{ letterSpacing: "3px" }}>Name</Form.Label>
                    <Form.Control onInput={(e) => setName(e.target.value)} className="border border-dark border-3" type="text" />
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label className="me-sm-2" htmlFor="inlineFormCustomSelect" visuallyHidden>
                        Preference
                    </Form.Label>
                    <Form.Select onChange={(e) => setlevelinx(e.target.value)} className="border border-dark border-3 fw-bold me-sm-2" id="inlineFormCustomSelect">
                        <option value="0">Easy</option>
                        <option value="1">Medium</option>
                        <option value="2">Hard</option>
                    </Form.Select>
                </Form.Group>
                <div className="d-grid">
                    <Button onClick={handleSubmit} className="text-uppercase fw-bold" variant="dark" type="submit">
                        Start
                    </Button>
                </div>
            </Form>
        </div >
    )
}
