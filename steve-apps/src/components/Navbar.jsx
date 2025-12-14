import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from './Button';
import content from '../data/content.json';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { global } = content;

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const handleLogoClick = () => {
        setIsOpen(false);
        window.scrollTo(0, 0);
    };

    return (
        <nav className={styles.nav}>
            <div className={`container ${styles.container}`}>
                <Link to="/" className={styles.logo} onClick={handleLogoClick}>
                    {global.siteName}
                </Link>

                {/* Desktop Menu */}
                <div className={styles.desktopMenu}>
                    <ul className={styles.links}>
                        {global.navigation.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`${styles.link} ${location.pathname === item.path ? styles.active : ''}`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Button to={global.cta.bookingLink} variant="inverted" className={styles.cta}>
                        {global.cta.primary}
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button className={styles.mobileToggle} onClick={toggleMenu} aria-label="Toggle menu">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Mobile Menu Overlay */}
                {isOpen && (
                    <div className={styles.mobileMenu}>
                        <ul className={styles.mobileLinks}>
                            {global.navigation.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={styles.mobileLink}
                                        onClick={closeMenu}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className={styles.mobileCta}>
                            <Button to={global.cta.bookingLink} variant="primary" onClick={closeMenu} style={{ width: '100%' }}>
                                {global.cta.primary}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
