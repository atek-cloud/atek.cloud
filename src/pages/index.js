import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <img className={styles.heroImg} src="/img/logo.png" />
        <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Atek - a personal cloud for the Web 3.0"
      description={siteConfig.description}>
      <HomepageHeader />
      <main>
        <div className={styles.explanation}>
          <div>
            Atek is a personal server that uses the Web 3.0 to connect you to the world.
          </div>
        </div>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
