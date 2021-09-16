import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';
import styles from './Tweets.module.css';

const f = new Intl.DateTimeFormat('en', {day: 'numeric', month: 'short', year: 'numeric'})

function Tweet({tweet}) {
  const tweetUrl = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
  let text = tweet.full_text
  if (tweet.entities?.media?.length) {
    for (let item of tweet.entities.media) {
      text = text.replace(item.url, '')
    }
  }
  let textParsed = text.split(/\s/i).map(seg => {
    if (seg.startsWith('@')) {
      return <Link to={`https://twitter.com/${seg.slice(1).replace(/[^a-z0-9_]/gi, '')}`}>{seg} </Link>
    }
    if (tweet.entities?.urls?.length) {
      for (let item of tweet.entities.urls) {
        if (seg === item.url) {
          return <Link to={item.expanded_url}>{item.expanded_url} </Link>
        }
      }
    }
    return seg + ' '
  })
  
  return (
    <div className={styles.tweet}>
      <div className={styles.tweetHeader}>
        <Link to={`https://twitter.com/${tweet.user.screen_name}`} alt={tweet.user.name}>{tweet.user.name}</Link>
        <Link to={`https://twitter.com/${tweet.user.screen_name}`} alt={tweet.user.screen_name}>@{tweet.user.screen_name}</Link>
        &middot;
        <Link to={tweetUrl}>{f.format(new Date(tweet.created_at))}</Link>
      </div>
      <div className={styles.tweetBody}>
        {textParsed}
      </div>
      {tweet.entities?.media?.length ?
        <div className={styles.tweetMedia}>
          {tweet.entities.media.map(item => <div key={item.id}><Link to={tweetUrl}><img src={item.local_path}/></Link></div>)}
        </div>
      : ''}
    </div>
  );
}


export default function Tweets() {
  const data = usePluginData('get-tweets')
  return (
    <div className={styles.tweets}>
      {data.tweets.slice(0, 5).map(tweet => <Tweet key={tweet.id} tweet={tweet} />)}
      <div className={styles.more}>
        <Link to="https://twitter.com/atek_cloud">More tweets from Atek &rarr;</Link>
      </div>
    </div>
  );
}
