import React, { useState } from 'react';
import styles from './Inputs.module.css'

interface SelectProps {
    label?:string
    placeholder?: string;
    onSelect?: (value: string) => void;
    children: React.ReactNode;
}

const OpenIcon = () => (
    <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.29289 8.70711C7.68342 9.09763 8.31658 9.09763 8.70711 8.70711L15.0711 2.34315C15.4616 1.95262 15.4616 1.31946 15.0711 0.928932C14.6805 0.538408 14.0474 0.538408 13.6569 0.928932L8 6.58579L2.34315 0.928932C1.95262 0.538408 1.31946 0.538408 0.928932 0.928932C0.538408 1.31946 0.538408 1.95262 0.928932 2.34315L7.29289 8.70711ZM7 7V8H9V7H7Z" fill="#336CFF"/>
    </svg>
  );
  
  const CloseIcon = () => (
    <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.70717 0.292893C8.31664 -0.0976312 7.68348 -0.0976312 7.29295 0.292893L0.928992 6.65685C0.538468 7.04738 0.538468 7.68054 0.928992 8.07107C1.31952 8.46159 1.95268 8.46159 2.34321 8.07107L8.00006 2.41421L13.6569 8.07107C14.0474 8.46159 14.6806 8.46159 15.0711 8.07107C15.4617 7.68054 15.4617 7.04738 15.0711 6.65685L8.70717 0.292893ZM9.00006 2V1H7.00006V2H9.00006Z" fill="#336CFF"/>
    </svg>
  );

export function Select({ placeholder, onSelect, children , label }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | undefined>(placeholder);

    const handleOptionClick = (value: string) => {
        setSelectedValue(value);
        setIsOpen(false);
        if (onSelect) {
            onSelect(value);
        }
    };

    return (
        <div className={styles.selectContainer}>
            {label && (
                <p className={styles.label}>{label}</p>
            )}
            <div className={styles.select} role="listbox" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
                <p>{selectedValue || placeholder || ''}</p>
                {isOpen && (
                    <ul>
                        {React.Children.map(children, (child) => {
                            const option = child as React.ReactElement;
                            return (
                                <li key={option.props.value} onClick={() => handleOptionClick(option.props.value)}>
                                    {option.props.children}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
    
}
