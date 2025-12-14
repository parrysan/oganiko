import React from 'react';
import content from '../data/content.json';
import styles from './Page.module.css';
import Button from '../components/Button';

const Contact = () => {
    const { contact } = content;

    return (
        <div className={styles.pageWrapper}>
            <section className="section">
                <div className="container" style={{ maxWidth: '600px' }}>
                    <h1 className="t-h1">{contact.title}</h1>
                    <p className="t-body" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
                        {contact.desc}
                    </p>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Name</label>
                            <input type="text" style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email</label>
                            <input type="email" style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>What's the situation?</label>
                            <textarea rows="4" style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid var(--color-border)' }}></textarea>
                        </div>
                        <Button variant="primary" type="submit" style={{ alignSelf: 'flex-start' }}>
                            Send Request
                        </Button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Contact;
