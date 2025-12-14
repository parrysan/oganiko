import React from 'react';
import content from '../data/content.json';
import styles from './Page.module.css'; // Shared page styles

const About = () => {
    const { about } = content;

    return (
        <div className={styles.pageWrapper}>
            <section className="section">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h1 className="t-h1" style={{ marginBottom: 'var(--space-lg)' }}>About Steve</h1>
                    <p className="t-body" style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xl)' }}>
                        {about.bio}
                    </p>

                    <div className={styles.divider}></div>

                    <h2 className="t-h2" style={{ marginBottom: 'var(--space-lg)' }}>Milestones</h2>
                    <div className={styles.timeline}>
                        {about.milestones.map((item, index) => (
                            <div key={index} className={styles.timelineItem}>
                                <span className={styles.year}>{item.year}</span>
                                <span className={styles.milestoneTitle}>{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
