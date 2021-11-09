import React, { useState, useEffect } from "react";
import { useTimerService } from "../../services/timerService";
import { Button } from "../Button/Button";
import { Timer } from "../Timer/Timer";
import "./timerWrapper.css";

export const TimerWrapper = () => {
  const [time, setTime] = useState(0);
  const [timeArray, setTimeArray] = useState([time]);

  const [showStart, setShowStart] = useState(true);

  const [
    newTimer,
    resetTimer,
    stopTimer,
    syncItUp,
    startTimer,
    channel
  ] = useTimerService(time, setTime, setShowStart, timeArray, setTimeArray);

  useEffect(() => {
    setShowStart(localStorage.getItem("stopTick") ? true : false);

    channel.onmessage = (ev) => {
      if (ev.data === "reset") {
        setTimeArray([]);
        setTime(0);
        return;
      }
      if (ev.data === "stop") {
        setShowStart(true);
      }
      if (ev.data.timeArr) {
        setTimeArray(ev.data.timeArr);
      }
      if (ev.data.timeArr) {
        setTimeArray(ev.data.timeArr);
      }
      if (ev.data.timeNow) {
        const timeNow = new Date().getTime();
        startTimer(1000 - (timeNow - ev.data));
      }
    };

    return () => {
      channel.close();
    };
  }, [channel, startTimer, showStart, timeArray]);

  const generateKey = (pre) => {
    return `${pre}_${new Date().getTime()}`;
  };

  return (
    <div className="timer-container">
      <span>Timer</span>
      <Timer seconds={time} setSeconds={setTime} />
      {showStart ? (
        <div className="button-container">
          <Button value={"Start"} onPress={syncItUp} />
          <Button value={"Reset"} onPress={resetTimer} />
        </div>
      ) : (
        <div className="button-container">
          <Button value={"Stop"} onPress={stopTimer} />
          <Button value={"Lap"} onPress={newTimer} />
        </div>
      )}

      <div className="result-timer">
        {timeArray &&
          timeArray.map(
            (time, index) =>
              time !== 0 && (
                <div key={generateKey(time)} className="time-list">
                  <p className="time-text">{`Lap ${index + 1}`}</p>
                  <p className="time-text">{time}</p>
                </div>
              )
          )}
      </div>
    </div>
  );
};
