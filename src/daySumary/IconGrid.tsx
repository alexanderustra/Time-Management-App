import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { iconData } from '../components/Icons';
import styles from './daySumary.module.css';

function IconGrid({ onClick }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      {/* Input de búsqueda */}
      <input
        type="text"
        placeholder="Search Icon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        className={styles.searchInput} // Agrega estilos si lo deseas
      />

      <div className={styles.gridContainer}>
        {Object.entries(iconData).map(([category, icons]) => {
          // Filtrar íconos según el término de búsqueda
          const filteredIcons = icons.filter((iconName) =>
            iconName.toLowerCase().includes(searchTerm)
          );

          // Si no hay íconos que coincidan, no renderizar la categoría
          if (filteredIcons.length === 0) return null;

          return (
            <div key={category} className={styles.iconsContainer}>
              <h2>{category}</h2>
              <div className={styles.iconGrid} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(50px, 1fr))',
              gap: '10px',
            }}>
                {filteredIcons.map((iconName, index) => {
                  const IconComponent = FaIcons[iconName];

                  if (!IconComponent) {
                    return null;
                  }

                  return (
                    <div
                      key={index}
                      title={iconName}
                      onClick={() => onClick(iconName)}
                      className={styles.iconWrapper} // Puedes agregar estilos aquí
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
