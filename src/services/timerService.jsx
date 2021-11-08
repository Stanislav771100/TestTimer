import React, { useCallback } from 'react'


export const useTimerService = (time, setTime) => {

    const channel = new BroadcastChannel("timer")


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

    return [newTimer, resetTimer, stopTimer, syncItUp, startTimer, channel]


}
