import { useCallback, useState } from "react";

export const useTimerService = (
    time,
    setTime,
    setShowStart,
    timeArray,
    setTimeArray
) => {
    const { localStorage } = window;

    const channel = new BroadcastChannel("timer");

    const startTimer = useCallback(
        (delay) => {
            const interval = setInterval(() => {
                if (localStorage.getItem("stopTick")) {
                    channel.close();
                    clearInterval(interval);
                    return;
                }
                setTime((time) => time + 1);
            }, 1000);
        },
        [channel, setTime]
    );

    const syncItUp = () => {
        const timeNow = new Date().getTime();
        localStorage.clear("stopTick");
        channel.postMessage({timeNow: timeNow});
        startTimer(1000);
    };

    const stopTimer = () => {
        localStorage.setItem("stopTick", true);
        channel.postMessage("stop");
        setShowStart(true);
    };

    const resetTimer = () => {
        setTime(0);
        setTimeArray([]);
        channel.postMessage("reset");
        stopTimer();
    };

    const newTimer = () => {
        const timeArr = { timeArr: [...timeArray, time] }
        channel.postMessage(timeArr);

        setTimeArray([...timeArray, time]);
    };

    return [
        newTimer,
        resetTimer,
        stopTimer,
        syncItUp,
        startTimer,
        channel,
        timeArray
    ];
};
