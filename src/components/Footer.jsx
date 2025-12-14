import React from 'react';
import styles from './Footer.module.css';
import content from '../data/content.json';

const Footer = () => {
    const { global } = content;
    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>
                <div className={styles.left}>
                    <span className={styles.logo}>{global.siteName}</span>
                    <p className={styles.copyright}>© {year} All rights reserved.</p>
                </div>
                <div className={styles.right}>
                    {global.socials.map((social) => (
                        <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                            {social.platform}
                        </a>
                    ))}
                    <a href={`mailto:${global.contactEmail}`} className={styles.link}>Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
