import {  useRef } from "react";
import styles from '../timeOut.module.css'
import { Alarm } from "../alarmAnimation/Alarm";
interface ModalProps {
    active:boolean
    setActive: (value: boolean) => void; 
}

export const AlarmModal = ({ setActive ,active}: ModalProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    

    if (!audioRef.current) {
        audioRef.current =  new Audio("/notification.wav");
    }

    if (active) {
        audioRef.current.play();
    } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; 
    }

    const handleStop = () => {
        setActive(false);
    };

    return (
        active && 
        <div className={styles.alarmModal} >
            <Alarm />
            <button onClick={handleStop}>Close</button>
        </div>
    );
};
