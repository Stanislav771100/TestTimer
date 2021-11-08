import React from 'react'
import './button.css';



export const Button = ({value, onPress}) => {

    return (
        <div onClick={() => onPress()} className="button-container">
            <p>{value}</p>
        </div>
    )
}