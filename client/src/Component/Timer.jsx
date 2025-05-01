import React, { useState, useEffect } from "react";
import { useTimer, useTime } from "react-timer-hook";
const TimerPage = () => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 3600);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const {
    totalSeconds,
    milliseconds,
    seconds,
    minutes,
    hours,
    days,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp: time, autoStart: true });

  useEffect(() => {
    // Check if there's a saved startTime in localStorage on page load
    const storedStartTime = localStorage.getItem("startTime");
    if (storedStartTime) {
      const savedStartTime = parseInt(storedStartTime);
      const currentElapsedTime = Date.now() - savedStartTime;
      setStartTime(savedStartTime);
      setElapsedTime(currentElapsedTime);
    }
  }, []);

  const startTimer = () => {
    start();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Timer</h1>

      <div style={{ fontSize: "100px" }}>
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <div>
        <button
          onClick={startTimer}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Start Timer
        </button>
      </div>
    </div>
  );
};

export default TimerPage;
