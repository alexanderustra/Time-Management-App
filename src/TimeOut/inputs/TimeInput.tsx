import React from "react";
import { Select } from "../../components/Select"; 
import { Data } from "../types/types";
import styles from '../timeOut.module.css'
interface Props {
  end: number;
  setData: React.Dispatch<React.SetStateAction<Data>>;
  error?: string;
  hoursOptions: number[];
  minutesOptions: number[];
}

export default function TimeSelector({
    setData,
    error,
    hoursOptions,
    minutesOptions,
  }: Props) {
    return (
      <div className={styles.selectContainer}>
        <Select
          error={!!error}
          label={error}
          onSelect={(e: any) =>
            setData((prev) => ({
              ...prev,
              end: Number(e) * 60 + (prev.end % 60),
            }))
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
          onSelect={(e: any) =>
            setData((prev) => ({
              ...prev,
              end: Math.floor(prev.end / 60) * 60 + Number(e),
            }))
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
    );
  }