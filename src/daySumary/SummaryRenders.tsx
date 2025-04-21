import styles from './daySumary.module.css'

interface SummaryProps {
  createdActivities: { name: string; color: string }[];
  summaryData: Record<string, number>;
  title: string;
}

export const SummaryRender = ({ createdActivities, summaryData, title }: SummaryProps) => {
  const totalTime = Object.values(summaryData).reduce((acc, duration) => acc + duration, 0);

  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {Object.entries(summaryData).map(([name, duration]) => {
          const percentage = totalTime ? (duration / totalTime) * 100 : 0;
          const activityColor =
            createdActivities.find((activity) => activity.name === name)?.color || '#20DBAE';

          return (
            <li key={name} className={styles.list}>
              <h3 className={styles.listName}>{name}</h3>
              <h3 className={styles.time}>
                {Math.floor(duration / 60)}h {duration % 60}m
              </h3>
              <div
                style={{
                  width: `${percentage}%`,
                  backgroundColor: activityColor,
                }}
              ></div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};