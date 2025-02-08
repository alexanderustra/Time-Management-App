import { useRef } from 'react';
import './alarm.css';

export const Alarm = () => {
    const iconRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={iconRef} className="ac-animated-svg-icon ac-svg-animated ac-svg-shadow">
                    <div className="ac-animated-svg-icon-contents">
                        <div className="ac-animated-svg-alarmclock">
                            <div className="svg-alarmclock-in">
                                <img src="https://preview.animatedcreativity.com/svg/alarmclock/alarmclock.svg" className="svg-alarmclock" />
                                <img src="https://preview.animatedcreativity.com/svg/alarmclock/leftbell.svg" className="svg-left-bell" />
                                <img src="https://preview.animatedcreativity.com/svg/alarmclock/rightbell.svg" className="svg-right-bell" />
                                <img src="https://preview.animatedcreativity.com/svg/alarmclock/hour.svg" className="svg-hour" />
                                <img src="https://preview.animatedcreativity.com/svg/alarmclock/minute.svg" className="svg-minute" />
                            </div>
                        </div>
                    </div>
                </div>
    );
};
