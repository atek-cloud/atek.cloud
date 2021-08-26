import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Get Involved',
    src: '/img/get-involved.png',
    description: (
      <>
        Atek Cloud is built for community contributions. <Link to="https://github.com/atek-cloud">Join us on GitHub</Link> to get involved.
        We have a <Link to="https://github.com/atek-cloud/atek/discussions">Discussions Board</Link> as well.
      </>
    ),
  },
  {
    title: 'Read the Manual',
    src: '/img/manual.png',
    description: (
      <>
        The <Link to="/docs/manual/index">Atek Manual</Link> explains the architecture of Atek and how to work with it.
        This is a good place to start if you want to get involved.
      </>
    ),
  },
  {
    title: 'Read the Reference',
    src: '/img/reference.png',
    description: (
      <>
        The <Link to="/docs/reference/index">Atek Reference</Link> includes information about all APIs, tools, and schemas.
        You should be able to find usages and details here.
      </>
    ),
  },
];

function Feature({src, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureImg} src={src} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
