import * as FaIcons from 'react-icons/fa';
import {iconData} from '../components/Icons';


function IconGrid({onClick}) {

  return (
    <div>
      {Object.entries(iconData).map(([category, icons]) => (
        <div key={category} style={{ marginBottom: '20px' }}>
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
                  <IconComponent size={30} color="gray" />
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
