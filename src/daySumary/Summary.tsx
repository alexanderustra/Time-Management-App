
interface SummaryProps {
  dailySummary: Record<string, number>;
  weeklySummary: Record<string, number>;
  createdActivities: { name: string; color: string }[];
}

export const Summary = ({ dailySummary, weeklySummary, createdActivities }: SummaryProps) => {
  const calculatePercentage = (totalTime: number, duration: number) => {
    return totalTime ? (duration / totalTime) * 100 : 0;
  };

  return (
    <div className="summaryContainer">
      <h2>Day Summary</h2>
      <ul>
        {(() => {
          const totalDailyTime = Object.values(dailySummary).reduce((acc, duration) => acc + duration, 0);
          return Object.entries(dailySummary).map(([name, duration]) => {
            const percentage = calculatePercentage(totalDailyTime, duration);
            const activityColor = createdActivities.find((activity) => activity.name === name)?.color || "#20DBAE";
            return (
              <li key={name}>
                <h3 className="activityName">{name}</h3>
                <h3 className="activityTime">{Math.floor(duration / 60)}h {duration % 60}m</h3>
                <div className="progressBar">
                  <div
                    className="progressBarInner"
                    style={{ width: `${percentage}%`, backgroundColor: activityColor }}
                  ></div>
                </div>
              </li>
            );
          });
        })()}
      </ul>

      <h2>Week Summary</h2>
      <ul>
        {(() => {
          const totalWeeklyTime = Object.values(weeklySummary).reduce((acc, duration) => acc + duration, 0);
          return Object.entries(weeklySummary).map(([name, duration]) => {
            const percentage = calculatePercentage(totalWeeklyTime, duration);
            const activityColor = createdActivities.find((activity) => activity.name === name)?.color || "#20DBAE";
            return (
              <li key={name}>
                <h3 className="activityName">{name}</h3>
                <h3 className="activityTime">{Math.floor(duration / 60)}h {duration % 60}m</h3>
                <div className="progressBar">
                  <div
                    className="progressBarInner"
                    style={{ width: `${percentage}%`, backgroundColor: activityColor }}
                  ></div>
                </div>
              </li>
            );
          });
        })()}
      </ul>
    </div>
  );
};