const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Atek Cloud',
  tagline: 'Web 3.0 for humans',
  url: 'https://atek.cloud',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'atek-cloud',
  projectName: 'atek.cloud',
  themeConfig: {
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
};
