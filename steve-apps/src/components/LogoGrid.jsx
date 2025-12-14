import React from 'react';
import styles from './LogoGrid.module.css';

const LogoGrid = ({ title, logos }) => {
    return (
        <div className={styles.wrapper}>
            {title && <h3 className={styles.title}>{title}</h3>}
            <div className={styles.grid}>
                {logos.map((logo, index) => (
                    <div key={index} className={styles.logoItem}>
                        {/* Placeholder for actual logo image */}
                        <span className={styles.logoText}>{logo}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogoGrid;
