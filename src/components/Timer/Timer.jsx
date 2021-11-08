import React from 'react'
import './timer.css';



export const Timer = ({seconds, color}) => {


    return (
        <div style={{backgroundColor: color}} className="timer">
            <span>{`${seconds < 10 ? '0'+seconds : seconds}`}</span>
        </div>
    )
}