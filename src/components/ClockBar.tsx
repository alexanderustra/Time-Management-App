import  { useState, useEffect } from 'react';
import '../timer.css'

export const ClockBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const currentHour = time.getHours(); 
const currentMinutes = time.getMinutes();
const currentSeconds = time.getSeconds(); 

const totalSecondsInDay = 24 * 60 * 60;

const elapsedSeconds =
  currentHour * 60 * 60 + currentMinutes * 60 + currentSeconds; 

const progress = (elapsedSeconds / totalSecondsInDay) * 100;

const formattedMinutes = currentMinutes.toString().padStart(2, '0');

  return (
    <div className="clock-bar-container">
      <div className="day-label">{time.toLocaleString("en-US", { weekday: "long" })}</div>
      <div className="time-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
        <div className="markers">
          <span className="marker">1</span>
          <span className="marker">6</span>
          <span className="marker">12</span>
          <span className="marker">18</span>
          <span className="marker">00</span>
        </div>
      </div>
      <h3>{currentHour} : {formattedMinutes}</h3>
    </div>
  );
};
