import { useState, useEffect, useRef } from 'react';
import { useTimer } from './TimerContext';
import TimerView from './TimerRender';
import { useCountdownTimer } from './useCountdownTimer';

export const TimeOut = () => {
    const [showModal,setShowModal] = useState(false)
    const { timer, setTimer } = useTimer();
    const [timeLeft, setTimeLeft] = useState(timer.end * 60 - timer.elapsed);
    const [active,setActive] = useState(false)
    const [soundEnabled, setSoundEnabled] = useState(false); 
    const [paused,setPaused] = useState(()=>{
        const pausedLocal = localStorage.getItem('paused');
        return pausedLocal ? JSON.parse(pausedLocal) : false
    })
    const [elapsed,setElapsed] = useState(0)
    const [timerOn, setTimerOn] = useState(() => {
        const timerOnLocal = localStorage.getItem('timerOn');
        return timerOnLocal ? JSON.parse(timerOnLocal) : false;
    });
    
    const intervalRef = useRef(null); // Referencia para el intervalo
    const pausedRef = useRef(paused); // Referencia para la pausa
    // Calcula horas, minutos y segundos
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    const { startTimer } = useCountdownTimer(paused, setPaused, setTimeLeft, setElapsed);

      
    // Formatea el tiempo restante
    const formattedTime = hours > 0 
        ? `${hours}:${String(minutes).padStart(2, '0')} h`
        : `${minutes}:${String(seconds).padStart(2, '0')}`;


    useEffect(()=>{
        localStorage.setItem('timerOn',JSON.stringify(timerOn))
    },[timerOn])
    
    // Calcula el porcentaje de progreso basado en `elapsed`
    const progressPercentage = ((timer.end * 60 - timeLeft) / (timer.end * 60)) * 100;

    // Calcula el porcentaje de una pausa o timeline
    const percentage = (time:number) => (time / timer.end) * 100;

    useEffect(() => {
        
        if (timeLeft === 0 && soundEnabled) {
            handleSoundEffects();   
        }
        if (timer.timelines.some(timeline => timeline.time !== 0 && timeline.time === elapsed)) {
            handleSoundEffects();   
        }
        if (timer.pauses.some(pause => pause.start !== 0 && pause.start === elapsed || pause.end !== 0 && pause.end === elapsed)) {
             handleSoundEffects();   
        }
        
    }, [elapsed]); 
    
    
    const handleDelete =()=>{
        setTimerOn(false)
    }
    const handlePause = () => {
        // Alternar el estado de paused
        setPaused((prevPaused) => {
            const newPaused = !prevPaused;
            // Actualizar localStorage con el nuevo valor de paused
            localStorage.setItem('paused', JSON.stringify(newPaused));
            pausedRef.current = newPaused; // Actualizar el ref con el nuevo valor
            return newPaused; // Devolver el nuevo valor del estado
        });
    };
    
    const handleSoundEffects = () => {
        setActive(true);
        setTimeout(() => {
            setActive(false);
        }, 15000);
    };
    const handleEnableSound = () => {
        setSoundEnabled(!soundEnabled); 
    };
    return (
        <TimerView
            showModal={showModal}
            setShowModal={setShowModal}
            timerOn={timerOn}
            setTimerOn={setTimerOn}
            timer={timer}
            setTimer={setTimer}
            progressPercentage={progressPercentage}
            percentage={percentage}
            formattedTime={formattedTime}
            startTimer={startTimer}
            handleDelete={handleDelete}
            handlePause={handlePause}
            paused={paused}
            soundEnabled={soundEnabled}
            handleEnableSound={handleEnableSound}
            active={active}
            setActive={setActive}
            setTimeLeft={setTimeLeft}
        />
    );
};