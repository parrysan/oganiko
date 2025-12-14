import React from 'react';
import styles from './Page.module.css';

const Approach = () => {
    return (
        <div className={styles.pageWrapper}>
            <section className="section">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h1 className="t-h1" style={{ marginBottom: 'var(--space-lg)' }}>The Approach</h1>
                    <p className="t-body" style={{ marginBottom: 'var(--space-lg)' }}>
                        Leadership is Communication. Steve’s method is experiential, neuroscience-informed, and highly tailored.
                    </p>
                    <div className={styles.serviceCard}>
                        <h3 className="t-h3">1. Clarify the Stakes</h3>
                        <p>Understanding the context and the critical moment.</p>
                    </div>
                    <div className={styles.serviceCard} style={{ marginTop: 'var(--space-md)' }}>
                        <h3 className="t-h3">2. Shape the Message</h3>
                        <p>Crafting a narrative that connects and influences.</p>
                    </div>
                    <div className={styles.serviceCard} style={{ marginTop: 'var(--space-md)' }}>
                        <h3 className="t-h3">3. Rehearse under Pressure</h3>
                        <p>Simulating the environment to build true confidence.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Approach;
