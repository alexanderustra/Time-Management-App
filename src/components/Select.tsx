import React, { useState } from 'react';
import styles from './Inputs.module.css'

interface SelectProps {
    label?:any
    placeholder?: string;
    onSelect?: (value: string) => void;
    children: React.ReactNode;
    error?:boolean
}



export function Select({ placeholder, onSelect, children , label ,error}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

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
            <div className={styles.select} role="listbox" aria-expanded={isOpen} 
            style={{
                marginBottom: isOpen ? '140px' : '20px',
                borderColor: error ? '#EC6767' : '#EDEAE5'
              }}              
              onClick={() => setIsOpen(!isOpen)}
              >
                <p>{selectedValue ? selectedValue : placeholder || ''}</p>

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
