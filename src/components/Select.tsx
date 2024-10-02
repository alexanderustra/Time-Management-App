import React, { useState } from 'react';
import styles from './Inputs.module.css'

interface SelectProps {
    label?:string
    placeholder?: string;
    onSelect?: (value: string) => void;
    children: React.ReactNode;
}



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
