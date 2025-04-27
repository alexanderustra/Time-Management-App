import { useState, useEffect} from "react";
import { useHandleIconClick } from "./hooks/useHandleIconClick";
import { CreationModal } from "./components/CreationModal";

import styles from "./daySumary.module.css";
import "../App.css";
import { SummaryRender } from "./components/SummaryRenders";
import { ActivitiesProp, StoredActivity } from "./types/types";
import { useTimeUtils } from "./hooks/useTimeUtils";
import { ActivityIconList } from "./components/ActivityRender";
import { updateSummaries } from "./utils/updateSummaries";
import ContextMenu from "./components/ContextMenu";

export const DaySummary = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activities, setActivities] = useState<ActivitiesProp[]>(() => {
    const savedActivities = localStorage.getItem("savedActivities");
    return savedActivities ? JSON.parse(savedActivities) : [];
  });

  const { convertToMinutes, calculateDuration, groupByActivity } = useTimeUtils(currentTime);

  const [dailySummary, setDailySummary] = useState<Record<string, number>>(
    () => {
      const savedDailySummary = localStorage.getItem("dailySummary");
      return savedDailySummary ? JSON.parse(savedDailySummary) : {};
    }
  );

  const [weeklySummary, setWeeklySummary] = useState<Record<string, number>>(
    () => {
      const savedSummary = localStorage.getItem("weeklySummary");
      return savedSummary ? JSON.parse(savedSummary) : {};
    }
  );

  const [createdActivities, setCreatedActivities] = useState<StoredActivity[]>(
    () => JSON.parse(localStorage.getItem("activities") || "[]")
  );
  const [showMenu, setShowMenu] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(0);
  const [showModal, setShowModal] = useState(false);

   //Actualizar resumenes díarios y semanales
   useEffect(() => {
    updateSummaries({
      activities,
      weeklySummary,
      setActivities,
      setWeeklySummary,
      setDailySummary,
      groupByActivity,
    });
  }, [activities]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateActivities = () => {
      setActivities(prev => prev.map(activity => ({
        ...activity,
        totalDuration: activity.active ? activity.totalDuration + 1 : activity.totalDuration
      })));
    };


    const interval = setInterval(updateActivities, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();

      if (now.getHours() === 17 && now.getMinutes() === 28) {
        setActivities((prev) =>
          prev.map((activity) => {
            if (!activity.active) {
              return {
                ...activity,
                totalDuration: 0,
                active: false,
              };
            }
            return activity;
          })
        );
        updateSummaries({
          activities,
          weeklySummary,
          setActivities,
          setWeeklySummary,
          setDailySummary,
          groupByActivity,
        });
      }
    };
  
    const interval = setInterval(checkMidnight, 1000);
    return () => clearInterval(interval);
  }, [activities, groupByActivity]);
  

  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(createdActivities));
    localStorage.setItem("savedActivities", JSON.stringify(activities));
  }, [createdActivities, activities]);  

  const handleContextMenu = (
    index: number,
    e: React.MouseEvent<HTMLElement>  
  ) => {
    e.preventDefault();  
    setShowMenu(true);
    setIndexToDelete(index);
    console.log(showMenu)
  };

  const handleDeleteActivity = (indexToRemove: number) => {
    //desactivar la actividad antes de eliminarla para que no sume más tiempo.
    setActivities((prev) => {
      const newActivities = prev.map((activity, idx) =>
        idx === indexToRemove ? { ...activity, active: false } : activity
      );
      return newActivities.filter((_, idx) => idx !== indexToRemove);
    });
  
    setCreatedActivities((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleIconClick = useHandleIconClick(setActivities);
  
  return (
    <section
      className={styles.a}
      onClick={() => {
        setIndexToDelete(0);
        setShowMenu(false);
      }}
    >
      <h2 className="titleH2">Activities</h2>
      <ActivityIconList onContextMenu={handleContextMenu} onIconClick={handleIconClick} activities={activities} createdActivities={createdActivities}  />
      {showMenu && (
        <div className="menu" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              if (indexToDelete !== null && indexToDelete !== undefined) {
                handleDeleteActivity(indexToDelete);
                setIndexToDelete(0);
                setShowMenu(false);
              }
            }}
          >
            Delete
          </button>
        </div>
      )}
      {showModal && (
        <CreationModal
          setCreatedActivities={setCreatedActivities}
          setActive={setShowModal}
        />
      )}
      <button onClick={() => setShowModal(!showModal)}>
        {showModal ? "Cancel" : "New Activity"}
      </button>

      <ContextMenu
        showMenu={showMenu}
        handleDeleteActivity={handleDeleteActivity}
        indexToDelete={indexToDelete}
        setIndexToDelete={setIndexToDelete}
        setShowMenu={setShowMenu}
      />

      <div>
        <SummaryRender
          createdActivities={createdActivities}
          summaryData={dailySummary}
          title="Day Summary"
        />
        <SummaryRender
          createdActivities={createdActivities}
          summaryData={weeklySummary}
          title="Week Summary"
        />
      </div>
    </section>
  );
};