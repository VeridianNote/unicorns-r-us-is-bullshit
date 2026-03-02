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

  headTags: [
    // Open Graph defaults (page-level description overrides via frontmatter)
    {tagName: 'meta', attributes: {property: 'og:type', content: 'website'}},
    {tagName: 'meta', attributes: {property: 'og:site_name', content: 'Unicorns R Us Is Bullshit'}},
    // Uncomment when OG image is ready:
    // {tagName: 'meta', attributes: {property: 'og:image', content: 'https://unicorns-r-us-is-bullshit.com/img/og-image.png'}},
    // {tagName: 'meta', attributes: {name: 'twitter:card', content: 'summary_large_image'}},
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        {name: 'description', content: 'An evidence-based rebuttal of the Unicorns-R-Us website and how it gets weaponized in polyamorous communities.'},
        {name: 'keywords', content: 'unicorn hunting, polyamory, unicorns-r-us, ethical non-monogamy, triad, couple privilege, poly community'},
      ],
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
