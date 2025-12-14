import React from 'react';
import content from '../data/content.json';
import styles from './Page.module.css';
import Button from '../components/Button';

const Services = () => {
    const { services, global } = content;

    return (
        <div className={styles.pageWrapper}>
            <section className="section">
                <div className="container" style={{ maxWidth: '900px' }}>
                    <h1 className="t-h1" style={{ marginBottom: 'var(--space-xl)' }}>Services</h1>
                    <div className={styles.serviceList}>
                        {services.map((service, index) => (
                            <div key={index} className={styles.serviceCard}>
                                <h2 className="t-h3" style={{ marginBottom: 'var(--space-sm)' }}>{service.title}</h2>
                                <p className="t-small" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-md)', fontWeight: 600 }}>
                                    {service.target}
                                </p>
                                <p className="t-body" style={{ color: 'var(--color-text-muted)' }}>
                                    {service.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center' }}>
                        <Button to={global.cta.bookingLink} variant="primary">
                            Discuss a brief
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
