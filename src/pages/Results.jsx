import React from 'react';
import content from '../data/content.json';
import styles from './Page.module.css';
import LogoGrid from '../components/LogoGrid';

const Results = () => {
    const { home } = content;
    // In a real app we'd probably have deeper results data, 
    // but reusing home.proof.logos for now as requested by the v1 scope "Logo grid built from bio's client list"

    return (
        <div className={styles.pageWrapper}>
            <section className="section">
                <div className="container">
                    <h1 className="t-h1 text-center" style={{ marginBottom: 'var(--space-xl)' }}>Client Results</h1>
                    <LogoGrid logos={home.proof.logos} />

                    <div className={styles.divider}></div>

                    <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 className="t-h2" style={{ marginBottom: 'var(--space-lg)' }}>Impact Stories</h2>
                        <p className="t-body" style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                            "CFO of global FMCG: from dry results update to story that shifted investor sentiment."
                        </p>
                        {/* More stories would go here */}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Results;
