import { useState } from "react";
import { useTimer } from "./TimerContext";
import { Select } from "../components/Select";
import styles from './timeOut.module.css'
import { validateInputs,hoursOptions,minutesOptions } from "./utils";
import { CreationModalProps } from "./types";
import TimeSelector from "./inputs/TimeInput";
import TimelineInputs from "./inputs/TimelinesInput";
import PauseInputs from "./inputs/PausesInput";


export const CreationModal = ({ setShowModal,setTimerOn }: CreationModalProps) => {
  const { setTimer } = useTimer();
  const [data, setData] = useState({
    end: 0,
    elapsed: 0,
    timelines: [{ title: "title", time: 0 }],
    pauses: [{ start: 0, end: 0 }],
  });

  const [errors, setErrors] = useState({
    end: "",
    timelines: [] as string[],
    pauses: [] as { start: string; end: string }[],
  });
  
  const handleAddTimeline = () => {
    setData((prev) => ({
      ...prev,
      timelines: [...prev.timelines, { title: "", time: 0 }],
    }));
    setErrors((prev) => ({
      ...prev,
      timelines: [...prev.timelines, ""],
    }));
  };

  const handleAddPause = () => {
    setData((prev) => ({
      ...prev,
      pauses: [...prev.pauses, { start: 0, end: 0 }],
    }));
    setErrors((prev) => ({
      ...prev,
      pauses: [...prev.pauses, { start: "", end: "" }],
    }));
  };

  const handleChange = (
    index: number,
    field: string,
    value: string | number,
    type: "timeline" | "pause"
  ) => {
    setData((prev) => {
      const updated = { ...prev };
      if (type === "timeline") {
        updated.timelines = [...prev.timelines];
        updated.timelines[index] = { ...updated.timelines[index], [field]: value };
      } else if (type === "pause") {
        updated.pauses = [...prev.pauses];
        updated.pauses[index] = { ...updated.pauses[index], [field]: value };
      }
      return updated;
    });
  };
  const handleTimeChange = (
    index: number,
    hours: number,
    minutes: number,
    type: "timeline" | "pause",
    field: "time" | "start" | "end"
  ) => {
    const totalMinutes = hours * 60 + minutes;
    handleChange(index, field, totalMinutes, type);
  };
  
  const handleAddActivity = () => {
    if (!validateInputs(data, setErrors)) return;
  
    localStorage.setItem("timer", JSON.stringify(data));
    localStorage.setItem('timerOn',JSON.stringify(true))
    setTimer(data);
    setTimerOn(true)
    setShowModal(false);
  };
  
  return (
    <div className={styles.creationModal}>
      <h2>Time</h2>
      <TimeSelector
        end={data.end}
        setData={setData}
        error={errors.end}
        hoursOptions={hoursOptions}
        minutesOptions={minutesOptions}
      />
  
      <h2>Timelines</h2>
      
            <TimelineInputs
        timelines={data.timelines}
        errors={errors.timelines}
        handleChange={handleChange}
        handleTimeChange={handleTimeChange}
        handleAddTimeline={handleAddTimeline}
        hoursOptions={hoursOptions}
        minutesOptions={minutesOptions}
      />
  
      <h2>Pauses</h2>
      <PauseInputs
      pauses={data.pauses}
      errors={errors.pauses}
      handleTimeChange={handleTimeChange}
      handleAddPause={handleAddPause}
      hoursOptions={hoursOptions}
      minutesOptions={minutesOptions}
    />
      <button onClick={handleAddPause}>New</button>
      <button onClick={() => setShowModal(false)}>Close</button>
      <button onClick={handleAddActivity}>Add</button>
    </div>
  );
};