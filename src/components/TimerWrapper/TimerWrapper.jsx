import React, { useState, useEffect, useCallback } from 'react'
import { useTimerService } from '../../services/timerService';
import { Button } from '../Button/Button';
import { Timer } from '../Timer/Timer';
import './timerWrapper.css';



export const TimerWrapper = () => {


    const [time, setTime] = useState(0);

    const [newTimer, resetTimer, stopTimer, syncItUp, startTimer, channel] = useTimerService(time, setTime);



    useEffect(() => {
        channel.onmessage = ev => {
            console.log(ev);
            if (ev.data === 'reset') {
                setTime(0)
                return
            }
            const timeNow = new Date().getTime();
            startTimer(1000 - (timeNow - ev.data));
        };

        return () => {
            channel.close();
        };
    }, [channel, startTimer]);


    const currentTime = window.localStorage.getItem('currentTime')


    return (
        <div className="timer-container">
            <span>Timer</span>
            {currentTime &&
                <Timer color={'red'} seconds={currentTime} />
            }
            <Timer seconds={time} setSeconds={setTime} />
            <Button value={'Start'} onPress={syncItUp} />
            <Button value={'Stop'} onPress={stopTimer} />
            <Button value={'Reset'} onPress={resetTimer} />
            <Button value={'New'} onPress={newTimer} />
        </div>
    )
}