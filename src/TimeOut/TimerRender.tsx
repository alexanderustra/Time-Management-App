// TimerView.tsx
import React from 'react';
import styles from './timeOut.module.css'; 
import { AlarmModal } from './Modal';
import { CreationModal } from './CreationModal';

interface Timeline {
    title: string;
    time: number;
}

interface Pause {
    start: number;
    end: number;
}

interface TimerData {
    timelines: Timeline[];
    pauses: Pause[];
    elapsed: number;
    end: number;
}

interface TimerViewProps {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    timerOn: boolean;
    setTimerOn: React.Dispatch<React.SetStateAction<boolean>>;
    timer: TimerData;
    setTimer: React.Dispatch<React.SetStateAction<TimerData>>;
    progressPercentage: number;
    percentage: (value: number) => number;
    formattedTime: string;
    startTimer: () => void;
    handleDelete: () => void;
    handlePause: () => void;
    paused: boolean;
    soundEnabled: boolean;
    handleEnableSound: () => void;
    active: boolean;
    setActive: React.Dispatch<React.SetStateAction<boolean>>;
    setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
}

const TimerView: React.FC<TimerViewProps> = ({
    showModal,
    setShowModal,
    timerOn,
    setTimerOn,
    timer,
    setTimer,
    progressPercentage,
    percentage,
    formattedTime,
    startTimer,
    handleDelete,
    handlePause,
    paused,
    soundEnabled,
    handleEnableSound,
    active,
    setActive,
    setTimeLeft,
}) => {
    return (
        <>
            {showModal && (
                <CreationModal setShowModal={setShowModal} setTimerOn={setTimerOn} />
            )}
            {!timerOn && (
                <>
                    <h2 className="titleH2">Timer</h2>
                    <button onClick={() => setShowModal(true)}>Start Timer</button>
                </>
            )}

            {timerOn && (
                <div className={styles.progressBarContainer}>
                    <h2 className="titleH2">Timer</h2>
                    <div className={styles.progressBar} style={{
                        width: '100%',
                        height: '20px',
                        position: 'relative',
                        top: '30px',
                        zIndex: '1',
                    }}>
                        <div className={styles.percentage} style={{
                            borderRadius: progressPercentage > 97 ? '10px' : '10px 0px 0px 10px',
                            width: `${progressPercentage}%`,
                            height: '100%',
                        }} />
                    </div>

                    <div className={styles.progressBarBack} style={{
                        position: 'relative',
                        width: '100%',
                        height: '20px',
                        marginTop: '10px',
                    }}>
                        {timer.timelines
                            .filter(t => t.time > 0)
                            .map((timeline, index) => (
                                <div className={styles.timelines} key={index} style={{
                                    position: 'absolute',
                                    left: `${percentage(timeline.time)}%`,
                                    width: '4px',
                                    height: '100%',
                                    zIndex: 3,
                                }}>
                                    <div className={styles.titlePopUp}>{timeline.title}</div>
                                </div>
                            ))}

                        {timer.pauses
                            .filter(p => p.end > 0)
                            .map((pause, index) => (
                                <div className={styles.pauses} key={index} style={{
                                    zIndex: 2,
                                    position: 'absolute',
                                    borderRadius: pause.start === 0 ? '10px 0px 0px 10px' : '0px',
                                    left: `${percentage(pause.start)}%`,
                                    width: `${percentage(pause.end - pause.start)}%`,
                                    height: '100%',
                                    opacity: 0.7,
                                }}>
                                    <p>{pause.start} - {pause.end}</p>
                                </div>
                            ))}
                    </div>

                    <div style={{ marginTop: '10px', zIndex: 2 }}>
                        Time Left: {formattedTime}
                    </div>
                    <br />
                    <button onClick={() => {
                        setTimer({ ...timer, elapsed: 0 });
                        setTimeLeft(timer.end * 60);
                        startTimer();
                    }}>
                        Restart
                    </button>
                    <button onClick={handleDelete}>Delete</button>
                    <button onClick={handlePause}>{paused ? 'Continue' : 'Pause'}</button>
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

export default TimerView;