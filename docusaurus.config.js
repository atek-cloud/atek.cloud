const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const Twitter = require('twitter')
const fs = require('fs')
const path = require('path')
const request = require('request')

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Atek Cloud',
  tagline: 'An open source peer-to-peer Home Cloud',
  url: 'https://atek.cloud',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'atek-cloud',
  projectName: 'atek.cloud',
  themeConfig: {
    image: 'img/logo-with-text.png',
    metadatas: [{name: 'twitter:card', content: 'summary_large_image'}],
    colorMode: {
      disableSwitch: true,
    },
    navbar: {
      title: 'Atek Cloud',
      logo: {
        alt: 'Atek Cloud Logo',
        src: 'img/logo-sm.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'manual/index',
          position: 'left',
          label: 'Manual',
        },
        {
          type: 'doc',
          docId: 'reference/cli',
          position: 'left',
          label: 'Reference',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/atek-cloud',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Manual',
              to: '/docs/manual/index',
            },
            {
              label: 'Reference',
              to: '/docs/reference/cli',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discussions',
              href: 'https://github.com/atek-cloud/atek/discussions',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/UUCVrFYksv'
            }
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/atek-cloud',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/atek_cloud'
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Blue Link Labs, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/atek-cloud/atek.cloud/edit/master/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/atek-cloud/atek.cloud/edit/master/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    function getTweets (context, options) {
      return {
        name: 'get-tweets',
        async loadContent () {
          if (!process.env.TWITTER_CONSUMER_KEY || !process.env.TWITTER_CONSUMER_SECRET || !process.env.TWITTER_BEARER_TOKEN) {
            console.log('Skipping tweet load: env params not set')
            return {tweets: []}
          }
          var client = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            bearer_token: process.env.TWITTER_BEARER_TOKEN
          });
          const tweets = await new Promise((resolve, reject) => {
            var params = {screen_name: 'atek_cloud', tweet_mode: 'extended'};
            console.log('Fetching tweets')
            client.get('statuses/user_timeline', params, function(error, tweets, response) {
              if (error) {
                console.error('Failed to fetch tweets', error)
              } else {
                console.log('Fetched tweets successfully')
              }
              if (error) reject(error)
              else resolve(tweets)
            })
          })
          for (const tweet of tweets.slice(0, 6)) { // we only show the last 6 tweets
            await downloadTweetMedia(tweet)
          }
          return {tweets}
        },
        contentLoaded ({content, actions}) {
          actions.setGlobalData({tweets: content.tweets})
        }
      }
    }
  ]
};

const TWITTER_MEDIA_DIR = path.join('static', 'img', 'twitter')
async function downloadTweetMedia (tweet) {
  if (tweet.entities?.media?.length) {
    for (const item of tweet.entities.media) {
      const filename = item.media_url.split('/').pop()
      const filepath = path.join(TWITTER_MEDIA_DIR, filename)
      item.local_path = `/img/twitter/${filename}`
      if (await fs.promises.stat(filepath).catch(e => undefined)) {
        console.log('Already downloaded', filepath)
        continue // file already exists
      }
      console.log('Downloading tweet media', filename)
      await new Promise((resolve, reject) => {
        request(item.media_url_https)
          .pipe(fs.createWriteStream(filepath))
          .on('close', resolve)
          .on('error', reject)
      })
      console.log('Downloaded tweet media', filename)
    }
  }
}