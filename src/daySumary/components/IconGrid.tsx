import { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { iconData } from '../../components/Icons';
import styles from '../daySumary.module.css'

type IconGridProps = {
  onClick: (iconName: string) => void;
};
function IconGrid({ onClick }: IconGridProps) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="Search Icon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        className={styles.searchInput} 
      />

      <div className={styles.gridContainer}>
        {Object.entries(iconData).map(([category, icons]) => {
          const filteredIcons = icons.filter((iconName) =>
            iconName.toLowerCase().includes(searchTerm)
          );

          if (filteredIcons.length === 0) return null;

          return (
            <div key={category} className={styles.iconsContainer}>
              <h2>{category}</h2>
              <div className={styles.iconGrid} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))',
              gap: '10px',
            }}>
                {filteredIcons.map((iconName) => {
                  const IconComponent = FaIcons[iconName as keyof typeof FaIcons] as React.ElementType;

                  if (!IconComponent) {
                    return null;
                  }

                  return (
                    <div
                      key={iconName}
                      title={iconName.slice(2)}
                      onClick={() => onClick(iconName)}
                      className={styles.iconWrapper} 
                    >
                      <IconComponent size={30} color="#EDEAE5" />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default IconGrid;