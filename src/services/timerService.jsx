import { useCallback, useState } from 'react'


export const useTimerService = (time, setTime, setShowStart) => {


    const [timeArray, setTimeArray] = useState([time])

    const { localStorage } = window


    const channel = new BroadcastChannel("timer")

    console.log(JSON.parse(window.localStorage.getItem('currentTime')))


    const startTimer = useCallback(delay => {

        const interval = setInterval(() => {
            if (localStorage.getItem('stopTick')) {
                channel.close()
                clearInterval(interval)
                return
            }
            setTime(time => time + 1);
        }, 1000);
    }, [channel, setTime]);


    const syncItUp = () => {
        const timeNow = new Date().getTime();
        localStorage.clear('stopTick')
        channel.postMessage(timeNow);
        startTimer(1000);
    };


    const stopTimer = () => {
        localStorage.setItem('stopTick', true)
        setShowStart(true)
    }

    const resetTimer = () => {
        setTime(0)
        setTimeArray([])
        localStorage.clear('currentTime')
        channel.postMessage('reset')
        stopTimer()
    }

    const newTimer = () => {
        const storageTimeArr = JSON.parse(window.localStorage.getItem('currentTime'))
        console.log(storageTimeArr)
        console.log(timeArray);
        
        setTimeArray([...timeArray, time])
        console.log(timeArray)
    }

    return [newTimer, resetTimer, stopTimer, syncItUp, startTimer, channel, timeArray]


}
