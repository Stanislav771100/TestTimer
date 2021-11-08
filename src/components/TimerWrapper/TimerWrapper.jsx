import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '../Button/Button';
import { Timer } from '../Timer/Timer';
import './timerWrapper.css';



export const TimerWrapper = () => {

    const channel = new BroadcastChannel("timer");

    const [time, setTime] = useState(0);


    const startTimer = useCallback(delay => {
        window.localStorage.clear('currentTime')

        const interval = setInterval(() => {
            if (window.localStorage.getItem('stopTick')) {
                channel.close()
                clearInterval(interval)
                return
            }
            setTime(time => time + 1);
        }, 1000);
    }, [channel]);


    const syncItUp = () => {
        const timeNow = new Date().getTime();
        window.localStorage.clear('stopTick')
        channel.postMessage(timeNow);
        startTimer(1000);
    };


    const stopTimer = () => {
        window.localStorage.setItem('stopTick', true)
    }

    const resetTimer = () => {
        setTime(0)
        channel.postMessage('reset')
    }

    const newTimer = () => {
        window.localStorage.setItem('currentTime', time)
        stopTimer()
        resetTimer()
    }

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