import { useState } from "react";
import { useTimer } from "./TimerContext";
import { Select } from "../components/Select";
import styles from './timeOut.module.css'

interface CreationModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTimerOn:React.Dispatch<React.SetStateAction<boolean>>;
}

interface Errors {
  end: string;
  timelines: string[];
  pauses: { start: string; end: string }[];
}


export const CreationModal = ({ setShowModal,setTimerOn }: CreationModalProps) => {
  const { setTimer } = useTimer();
  const [data, setData] = useState({
    end: 0,
    elapsed: 0,
    timelines: [{ title: "title", time: 0 }],
    pauses: [{ start: 0, end: 0 }],
  });
  const hoursOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutesOptions = Array.from({ length: 61 }, (_, i) => (i).toString().padStart(2, '0'));

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

  const validateInputs = () => {
    let newErrors: Errors = { end: "", timelines: [], pauses: [] };

    if (data.end < 1) {
      newErrors.end = "End time must be at least 1 minute.";
    }
    

    data.timelines.forEach((tl, index) => {
      newErrors.timelines[index] = tl.time < 0 ? "Timeline time cannot be lower than 0." : "";
    });

    data.pauses.forEach((pause, index) => {
      newErrors.pauses[index] = {
        start: pause.start < 0 ? "Pause start cannot be lower than 0." : "",
        end: pause.end < 0 ? "Pause end cannot be lower than 0." : "",
      };

      if (pause.start > pause.end) {
        newErrors.pauses[index].end = "Pause end must be greater than start.";
      }
    });

    setErrors(newErrors);
    
    return !newErrors.end &&
      newErrors.timelines.every((err) => err === "") &&
      newErrors.pauses.every((p) => p.start === "" && p.end === "");
  };
  
  
  const handleAddActivity = () => {
    if (!validateInputs()) return;
  
    // Guardar los datos si todo está correcto
    localStorage.setItem("timer", JSON.stringify(data));
    localStorage.setItem('timerOn',JSON.stringify(true))
    setTimer(data);
    setTimerOn(true)
    setShowModal(false);
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
  
  return (
    <div className={styles.creationModal}>
      <h2>Time</h2>
      <div className={styles.selectContainer}>
      <Select
        error={!!errors.end}
        label={errors.end}
        onSelect={(e: any) => setData(prev => ({ ...prev, end: Number(e) * 60 + (prev.end % 60) }))}
        placeholder="Hours"
      >
        {hoursOptions.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </Select>

      <Select
        onSelect={(e: any) => setData(prev => ({ ...prev, end: Math.floor(prev.end / 60) * 60 + Number(e) }))}
        placeholder="Minutes"
      >
        {minutesOptions.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </Select>

      </div>
  
      <h2>Timelines</h2>
      {data.timelines.map((tl, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="title"
            value={tl.title}
            onChange={(e) => handleChange(index, "title", e.target.value, "timeline")}
          />
          <div className={styles.selectContainer}>
            <Select
              error={!!errors.timelines[index]}
              label={errors.timelines[index]}
              onSelect={(e: any) => handleTimeChange(index, Number(e), tl.time % 60, "timeline", "time")}
              placeholder="Hours"
            >
              {hoursOptions.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </Select>
            <Select
              error={!!errors.timelines[index]}
              label={errors.timelines[index]}
              onSelect={(e: any) => handleTimeChange(index, Math.floor(tl.time / 60), Number(e), "timeline", "time")}
              placeholder="Minutes"
            >
              {minutesOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </div>
        </div>
      ))}
      <button onClick={handleAddTimeline}>New</button>
  
      <h2>Pauses</h2>
      {data.pauses.map((pause, index) => (
        <div key={index}>
          <div className={styles.selectContainer}>
            <Select
              error={!!errors.pauses[index]?.start}
              label={errors.pauses[index]?.start}
              onSelect={(e: any) => handleTimeChange(index, Number(e), pause.start % 60, "pause", "start")}
              placeholder="Hours"
            >
              {hoursOptions.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </Select>
            <Select
              error={!!errors.pauses[index]?.start}
              label={errors.pauses[index]?.start}
              onSelect={(e: any) => handleTimeChange(index, Math.floor(pause.start / 60), Number(e), "pause", "start")}
              placeholder="Minutes"
            >
              {minutesOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </div>
  
          <div className={styles.selectContainer}>
            <Select
              error={!!errors.pauses[index]?.end}
              label={errors.pauses[index]?.end}
              onSelect={(e: any) => handleTimeChange(index, Number(e), pause.end % 60, "pause", "end")}
              placeholder="Hours"
            >
              {hoursOptions.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </Select>
            <Select
              error={!!errors.pauses[index]?.end}
              label={errors.pauses[index]?.end}
              onSelect={(e: any) => handleTimeChange(index, Math.floor(pause.end / 60), Number(e), "pause", "end")}
              placeholder="Minutes"
            >
              {minutesOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </div>
        </div>
      ))}
      <button onClick={handleAddPause}>New</button>
      <button onClick={() => setShowModal(false)}>Close</button>
      <button onClick={handleAddActivity}>Add</button>
    </div>
  );
  
};
