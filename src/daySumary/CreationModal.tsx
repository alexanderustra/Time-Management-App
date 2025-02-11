import { useState } from "react";
import IconGrid from "./IconGrid";
import styles from './daySumary.module.css'

interface Activity {
  name: string;
  icon: string;
  color: string; 
}

interface CreationModalProps {
  setActive: (value: boolean) => void; 
  setCreatedActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

export const CreationModal = ({ setCreatedActivities,setActive }: CreationModalProps) => {

  // Función para generar un color pastel
  const getRandomPastelHex = (): string => {
    const randomValue = () => Math.floor(127 + Math.random() * 128); // Asegura valores entre 127 y 255
    const toHex = (value: number) => value.toString(16).padStart(2, "0"); // Convierte a hexadecimal con dos dígitos
    const r = randomValue();
    const g = randomValue();
    const b = randomValue();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const [showIconGrid, setShowIconGrid] = useState(false);
  const [activityInfo, setActivityInfo] = useState<Activity>({
    name: "",
    icon: "",
    color: getRandomPastelHex(), 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivityInfo({ ...activityInfo, name: e.target.value });
  };

  const handleClick = () => {
    if (activityInfo.name && activityInfo.icon) {
      setCreatedActivities((prev) => [...prev, activityInfo]);
      setActivityInfo({
        name: "",
        icon: "",
        color: getRandomPastelHex(), // Genera un nuevo color para la siguiente actividad
      });
      setActive(false)
    } else {
      setShowIconGrid(true);
    }
  };

  const handleSelectIcon = (iconName: string) => {
    setActivityInfo({ ...activityInfo, icon: iconName });
    setShowIconGrid(false);
  };

  return (
    <div className={styles.creationModal}>
      <h2>Name</h2>
      {showIconGrid ? (
        <IconGrid onClick={handleSelectIcon} />
      ) : (
        <input
          type="text"
          placeholder="Activity Name"
          value={activityInfo.name}
          onChange={handleChange}
        />
      )}
      <button onClick={handleClick}>
        {activityInfo.name && activityInfo.icon ? "Complete" : showIconGrid ? "Back" : "Select Icon"}
      </button>
    </div>
  );
};
