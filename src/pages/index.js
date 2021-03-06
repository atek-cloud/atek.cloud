import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import Tweets from '../components/Tweets';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.heroImgContainer}>
          <img className={styles.heroImg} src="/img/logo.svg" />
        </div>
        <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <div className="homepage">
      <Layout
        title="Atek - An open source peer-to-peer Home Cloud"
        description={siteConfig.description}
      >
        <HomepageHeader />
        <main>
          <div className={styles.explanation}>
            <div>
              <h2>What is Atek?</h2>
              <p>
                Atek is a personal cloud for small home servers like <Link to="https://www.raspberrypi.org/">Raspberry Pis</Link>.
                It uses peer-to-peer tech to turn NodeJS programs into private, self-hosted Web apps with privacy and global connectivity.
              </p>
              <p><Link className="button button--primary button--lg" to="/docs/manual/getting-started">Get Started</Link></p>
            </div>
          </div>
          <HomepageFeatures />
          <div className={styles.tweets}>
            <Tweets />
          </div>
        </main>
      </Layout>
    </div>
  );
}
