import React, { useEffect } from 'react'
import { useShow } from '../context/EffectsContext'

export default function Watch({ open }) {
    const { handlePause, handleStart } = useShow()
    useEffect(() => {
        handleStart()
    }, [])
    const stop = () => {
        open()
        handlePause()
    }
    return (
        <div className="watch">
            <div className="watch__dial" id="watch">00:00:00</div>
            <div className="watch__pause" onClick={stop}>
                <i className="fas fa-pause"></i>
                {/* <Button onClick={handlePause}>Pause</Button> */}
            </div>
        </div>
    )
}
