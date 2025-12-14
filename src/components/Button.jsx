import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

const Button = ({ children, to, variant = 'primary', className = '', ...props }) => {
    const rootClassName = `${styles.btn} ${styles[variant]} ${className}`;

    if (to) {
        return (
            <Link to={to} className={rootClassName} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button className={rootClassName} {...props}>
            {children}
        </button>
    );
};

export default Button;
