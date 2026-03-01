/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Unicorns R Us Is Bullshit',
  tagline: 'Debunking the nonsense, one claim at a time',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://unicorns-r-us-is-bullshit.com',
  baseUrl: '/',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  clientModules: ['./src/progress-bar.js'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Unicorns R Us Is Bullshit',
        items: [
          {
            to: '/',
            label: '🦄 Home',
            position: 'left',
            activeBaseRegex: '^/$',
          },
          {
            to: '/poly-police',
            label: '🚨 Poly Police',
            position: 'left',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Content licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a>.`,
      },
    }),
};

export default config;
