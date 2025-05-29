import { useState } from "react";
import { useMemo } from "react";
import IconGrid from "./IconGrid";
import styles from '../daySumary.module.css'
import { getRandomPastelHex } from "../utils/utils";

export const CreationModal = ({ setCreatedActivities,setActive }:any) => {

  const [showIconGrid, setShowIconGrid] = useState(false);
  const randomColor = useMemo(() => getRandomPastelHex(), []);
  const [activityInfo, setActivityInfo] = useState({
    name: "",
    icon: "",
    color: randomColor, 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActivityInfo({ ...activityInfo, name: e.target.value });
  };

  const handleClick = () => {
    if (activityInfo.name && activityInfo.icon) {
      setCreatedActivities((prev:any) => [...prev, activityInfo]);
      setActivityInfo({
        name: "",
        icon: "",
        color: getRandomPastelHex(),
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