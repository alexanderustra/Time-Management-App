import { Select } from "../../components/Select";
import styles from '../timeOut.module.css'
interface Pause {
  start: number;
  end: number;
}

interface PauseError {
  start?: string;
  end?: string;
}

interface Props {
  pauses: Pause[];
  errors: PauseError[];
  handleTimeChange: (index: number, hours: number, minutes: number, type: "timeline" | "pause", field: "time" | "start" | "end") => void;
  handleAddPause: () => void;
  hoursOptions: number[];
  minutesOptions: number[];
}

export default function PauseInputs({
    pauses,
    errors,
    handleTimeChange,
    handleAddPause,
    hoursOptions,
    minutesOptions,
  }: Props) {
    return (
      <>
        {pauses.map((pause, index) => (
          <div key={index} className={styles.pauseBlock}>
            <div className={styles.selectContainer}>
              <Select
                error={!!errors[index]?.start}
                label={errors[index]?.start}
                onSelect={(e: any) =>
                  handleTimeChange(index, Number(e), pause.start % 60, "pause", "start")
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
                error={!!errors[index]?.start}
                label={errors[index]?.start}
                onSelect={(e: any) =>
                  handleTimeChange(index, Math.floor(pause.start / 60), Number(e), "pause", "start")
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
            <div className={styles.selectContainer}>
              <Select
                error={!!errors[index]?.end}
                label={errors[index]?.end}
                onSelect={(e: any) =>
                  handleTimeChange(index, Number(e), pause.end % 60, "pause", "end")
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
                error={!!errors[index]?.end}
                label={errors[index]?.end}
                onSelect={(e: any) =>
                  handleTimeChange(index, Math.floor(pause.end / 60), Number(e), "pause", "end")
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
        <button className={styles.addButton} onClick={handleAddPause}>
          New
        </button>
      </>
    );
  }