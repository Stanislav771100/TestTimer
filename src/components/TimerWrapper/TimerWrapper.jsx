import React, { useState, useEffect } from 'react'
import { useTimerService } from '../../services/timerService';
import { Button } from '../Button/Button';
import { Timer } from '../Timer/Timer';
import './timerWrapper.css';



export const TimerWrapper = () => {


    const [time, setTime] = useState(0);
    const [showStart, setShowStart] = useState(true)


    const [newTimer, resetTimer, stopTimer, syncItUp, startTimer, channel, timeArray] = useTimerService(time, setTime, setShowStart);


    useEffect(() => {
        localStorage.setItem('currentTime', JSON.stringify(timeArray))
    }, [timeArray])

    useEffect(() => {
        // setTimeArray(JSON.parse(window.localStorage.getItem('currentTime')))
        setShowStart(localStorage.getItem('stopTick') ? true : false)
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
    }, [channel, startTimer, showStart]);


    const currentTime = JSON.parse(window.localStorage.getItem('currentTime'))



    return (
        <div className="timer-container">
            <span>Timer</span>
            <Timer seconds={time} setSeconds={setTime} />
            {showStart ?
                <div className="button-container">
                    <Button value={'Start'} onPress={syncItUp} />
                    <Button value={'Reset'} onPress={resetTimer} />
                </div>
                :
                <div className="button-container">

                    <Button value={'Stop'} onPress={stopTimer} />
                    <Button value={'Lap'} onPress={newTimer} />
                </div>
            }

            <div className="result-timer">
                {currentTime && currentTime.map((time, index) => index !== 0 && (
                    <div key={time + index} className='time-list'>
                        <p className='time-text'>{`Lap ${index}`}</p>
                        <p className='time-text'>{time}</p>
                    </div>
                )
                )

                }
            </div>
        </div>
    )
}