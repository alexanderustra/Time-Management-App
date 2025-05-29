import { Select } from "../../components/Select";
import styles from '../timeOut.module.css'


interface Props {
  timelines: { title: string; time: number }[];
  errors: string[];
  handleChange: (index: number, field: string, value: any, type: "timeline" | "pause") => void;
  handleTimeChange: (index: number, hours: number, minutes: number, type: "timeline" | "pause", field: "time" | "start" | "end") => void;
  handleAddTimeline: () => void;
  hoursOptions: number[];
  minutesOptions: number[];
}

export default function TimelineInputs({
    timelines,
    errors,
    handleChange,
    handleTimeChange,
    handleAddTimeline,
    hoursOptions,
    minutesOptions,
  }: Props) {
    return (
      <>
        {timelines.map((tl, index) => (
          <div key={index} className={styles.timelineInput}>
            <input
              type="text"
              placeholder="title"
              value={tl.title}
              onChange={(e) =>
                handleChange(index, "title", e.target.value, "timeline")
              }
              className={styles.input}
            />
            <div className={styles.selectContainer}>
              <Select
                error={!!errors[index]}
                label={errors[index]}
                onSelect={(e: any) =>
                  handleTimeChange(index, Number(e), tl.time % 60, "timeline", "time")
                }
                placeholder="Hours"
              >
                {hoursOptions.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </Select>
              <Select
                error={!!errors[index]}
                label={errors[index]}
                onSelect={(e: any) =>
                  handleTimeChange(index, Math.floor(tl.time / 60), Number(e), "timeline", "time")
                }
                placeholder="Minutes"
              >
                {minutesOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        ))}
        <button className={styles.addButton} onClick={handleAddTimeline}>
          New
        </button>
      </>
    );
  }