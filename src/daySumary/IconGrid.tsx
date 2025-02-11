import * as FaIcons from 'react-icons/fa';
import {iconData} from '../components/Icons';
import styles from './daySumary.module.css'

function IconGrid({onClick}) {

  return (
    <div className={styles.gridContainer}>
      {Object.entries(iconData).map(([category, icons]) => (
        <div key={category} style={{ marginBottom: '20px' }} className={styles.iconsContainer}>
          <h2>{category}</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))',
              gap: '10px',
            }}
          >
            {icons.map((iconName, index) => {
              const IconComponent = FaIcons[iconName]; // Obtener el componente del ícono
              return IconComponent ? ( // Verificar que el ícono existe
                <div key={index} title={iconName}  onClick={() => onClick(iconName)}>
                  <IconComponent size={30} color="#EDEAE5" />
                </div>
              ) : (''
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default IconGrid;
