import React from 'react';
import styles from './Home.module.css';
import content from '../data/content.json';
import Button from '../components/Button';
import LogoGrid from '../components/LogoGrid';

const Home = () => {
    const { home, global } = content;

    return (
        <div className={styles.homeWrapper}>

            {/* 1. New Hero Section */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroContainer}`}>
                    <div className={styles.heroContent}>
                        <span className={styles.eyebrow}>{home.hero.eyebrow}</span>
                        <h1 className={styles.headline}>{home.hero.headline}</h1>
                        <p className={styles.subtext}>{home.hero.subtext}</p>
                    </div>
                    <div className={styles.heroImageWrapper}>
                        <img src="/steve_hero.png" alt={home.hero.imageAlt} className={styles.heroImage} />
                    </div>
                </div>
            </section>

            {/* 2. Journey Section */}
            <section className="section">
                <div className="container text-center">
                    <h2 className="t-h3" style={{ marginBottom: 'var(--space-xl)' }}>{home.journey.title}</h2>
                    <div className={styles.journeyGrid}>
                        {home.journey.steps.map((step) => (
                            <div key={step.step} className={styles.journeyStep}>
                                <div className={styles.stepNumber}>{step.step}</div>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDesc}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Expert Coaching Grid */}
            <section className={`${styles.coachingSection}`}>
                <div className="container">
                    <h2 className="t-h2 text-white" style={{ marginBottom: 'var(--space-lg)' }}>{home.coaching.title}</h2>
                    <div className={styles.coachingGrid}>
                        {home.coaching.items.map((item, index) => (
                            <div key={index} className={styles.coachingCard}>
                                <h3 className={styles.coachingTitle}>{item.title}</h3>
                                <p className={styles.coachingDesc}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Experience Cards */}
            <section className="section bg-alt">
                <div className="container">
                    <h2 className="t-h2" style={{ marginBottom: 'var(--space-xl)' }}>{home.experience.title}</h2>
                    <div className={styles.experienceGrid}>
                        {home.experience.cards.map((card, index) => (
                            <div key={index} className={styles.experienceCard}>
                                <h3 className={styles.expTitle}>{card.title}</h3>
                                <p className={styles.expSubtitle}>{card.subtitle}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Trust / Proof */}
            <section className="section">
                <div className="container">
                    <LogoGrid title={home.proof.title} logos={home.proof.logos} />
                </div>
            </section>

            {/* 6. Final CTA */}
            <section className={styles.finalCta}>
                <div className="container text-center">
                    <h2 className="t-h2 text-white" style={{ marginBottom: 'var(--space-md)' }}>
                        {home.finalCta.title}
                    </h2>
                    <p className="text-white" style={{ marginBottom: 'var(--space-lg)', opacity: 0.9 }}>
                        {home.finalCta.desc}
                    </p>
                    <Button to={global.cta.bookingLink} className={styles.ctaButtonWhite}>
                        {global.cta.primary}
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Home;
