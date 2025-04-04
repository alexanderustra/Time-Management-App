import { useState, useEffect, useRef } from 'react';
import { useTimer } from './TimerContext';
import styles from './timeOut.module.css';
import { CreationModal } from './CreationModal';
import { AlarmModal } from './Modal';

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

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}:${String(mins).padStart(2, "0")} h` : `${mins} min`;
      };
      
    // Formatea el tiempo restante
    const formattedTime = hours > 0 
        ? `${hours}:${String(minutes).padStart(2, '0')} h`
        : `${minutes}:${String(seconds).padStart(2, '0')}`;

    const startTimer = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    
        intervalRef.current = setInterval(() => {
            if (pausedRef.current) {
                return; // Si está pausado, no hace nada
            }
            setTimer((prev) => {
                const newElapsed = prev.elapsed + 1;
                const newTimeLeft = prev.end * 60 - newElapsed;
    
                const elapsedInMinutes = newElapsed / 60;

                 // Actualizar estados
                setTimeLeft(newTimeLeft);
                setElapsed(elapsedInMinutes);

                // Detén el intervalo cuando se alcance el final
                if (newTimeLeft <= 0) {
                    clearInterval(intervalRef.current!);
                    return { ...prev, elapsed: prev.end * 60 };
                }
                // Solo actualiza el estado si el tiempo ha cambiado significativamente
                const updatedTimer = { ...prev, elapsed: newElapsed };
                localStorage.setItem('timer', JSON.stringify(updatedTimer)); // Actualizar el temporizador completo
                localStorage.setItem('elapsed', String(newElapsed)); // Guardar solo el tiempo transcurrido
                return updatedTimer;
            });
        }, 1000);
    };
    useEffect(() => {
        startTimer();
        // Limpia el intervalo cuando el componente se desmonta
        return () => clearInterval(intervalRef.current);
    }, []);

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
        <>
            {showModal && (
                        <CreationModal setShowModal={setShowModal} setTimerOn={setTimerOn} />
                    )}
            {!timerOn && (
                <>
                <h2 className='titleH2'>Timer</h2>
                <button onClick={() => setShowModal(true)}>Start Timer</button>
                </>
            )}
    
            {timerOn && (
                <div className={styles.progressBarContainer}>
                    {/* Barra de progreso */}
                    <h2 className='titleH2'>Timer</h2>
                    <div
                        className={styles.progressBar}
                        style={{
                            width: '100%',
                            height: '20px',
                            position: 'relative',
                            top: '30px',
                            zIndex: '1',
                        }}
                    >
                        <div
                            className={styles.percentage}
                            style={{
                                borderRadius: progressPercentage > 97 ? '10px 10px 10px 10px' : '10px 0px 0px 10px',
                                width: `${progressPercentage}%`,
                                height: '100%',
                            }}
                        />
                    </div>
    
                    {/*timeline y pausas */}
                    <div
                        className={styles.progressBarBack}
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '20px',
                            marginTop: '10px',
                        }}
                    >
                        {timer.timelines
                            .filter(timeline => timeline.time > 0)
                            .map((timeline, index) => (
                                <div
                                    className={styles.timelines}
                                    key={index}
                                    style={{
                                        position: 'absolute',
                                        left: `${percentage(timeline.time)}%`,
                                        width: '4px',
                                        height: '100%',
                                        zIndex: '3',
                                    }}
                                >
                                    <div className={styles.titlePopUp}>
                                        {timeline.title}
                                    </div>
                                </div>
                            ))}
                        {timer.pauses
                            .filter(pause => pause.end > 0)
                            .map((pause, index) => (
                                <div
                                    className={styles.pauses}
                                    key={index}
                                    style={{
                                        zIndex: '2',
                                        position: 'absolute',
                                        borderRadius: pause.start === 0 ? '10px 0px 0px 10px' : '0px',
                                        left: `${percentage(pause.start)}%`,
                                        width: `${percentage(pause.end - pause.start)}%`,
                                        height: '100%',
                                        opacity: 0.7,
                                    }}
                                    title={`Pause: ${pause.start}-${pause.end}`}
                                >
                                    <p>{pause.start} - {pause.end}</p>
                                </div>
                            ))}
                    </div>
    
                    {/*tiempo restante */}
                    <div style={{ marginTop: '10px', zIndex: '2' }}>
                        Time Left: {formattedTime}
                    </div>
                    <br />
                    <button
                        onClick={() => {
                            setTimer({ ...timer, elapsed: 0 });
                            setTimeLeft(timer.end * 60);
                            startTimer();
                        }}
                    >
                        Restart
                    </button>
                    <button onClick={handleDelete}>Delete</button>
                    <button onClick={handlePause}>{paused ? 'Continue':'Pause'}</button>
                    <button onClick={() => setShowModal(!showModal)}>New</button>
                    <button onClick={handleEnableSound}>
                        {soundEnabled ? 'Disable Sound' : 'Enable Sound'}
                    </button>
                    {active && <AlarmModal setActive={setActive} active={active} />}
                </div>
            )}
        </>
    );
};