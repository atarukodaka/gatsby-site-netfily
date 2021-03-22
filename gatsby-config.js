/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

module.exports = {
  /* Your site config here */
  siteMetadata: {
    title: 'Ataru Kodaka Site',
    author: 'Ataru KODAKA',
    email: 'ataru.kodaka@gmail.com',
    description: 'THIS SITE IS ......WHATS THE FUNNY ?',
    siteUrl: 'https://atarukodaka.github.io',
    //siteUrl: 'https://cranky-williams-77ca16.netlify.app',
    //siteUrl: `http://localhost:8000/`,
    coverImage: '/images/top.png',
    social: {
      twitter: 'ataru_kodaka',
      github: 'atarukodaka',
    }
  },
  plugins: [
    `gatsby-plugin-mdx`,
    {
      resolve: `gatsby-theme-aksite`,
      options: {
        contentPath: `content/posts`,
        //basePath: '/blog',
        defaultLang: 'ja',

        directoryLabels: [
          { directory: "workout", label: "ワークアウト" },
          { directory: "game", label: "ゲーム" },
          { directory: "game/kancolle", label: "艦これ" },
          { directory: "game/kancolle/event", label: "イベント" },
          { directory: "game/wot", label: "WOT" },
          { directory: "game/umamusume", label: "ウマ娘" },
          { directory: "software", label: "ソフトウェア" },
          { directory: "software/gatsby", label: "Gatsby" },
          { directory: "figureskating", label: "フィギュアスケート" },
          { directory: "figureskating/practise", label: "銀盤練習" },
          { directory: "culture", label: "カルチャー" },
          { directory: "hobby", label: "趣味" }
        ]

        /*
        directoryLabels: {
          "/workout": "ワークアウト",
          "/game": "ゲーム",
          "/game/kancolle": "艦これ",
          "/game/kancolle/event": "イベント",
          "/game/wot": "World of Tanks",
          "/game/umamusume": "ウマ娘",
          "/software": "ソフトウェア",
          "/software/gatsby": "Gatsby",
          "/software/middleman/susume": "Middlemanのすすめ",
          "/figureskating": "フィギュアスケート",
          "/figureskating/practise": "銀盤練習",
          "/hobby": "趣味" ,
          "/culture": "カルチャー"

        }
        */
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'site name',
        shrot_name: 'site short name',
        start_url: '/?utm_source=homescreen',
        theme_color: '#eee',
        display: 'minimal-ui',
        icon: 'static/icons/icon-72x72.jpg'
        /*
        icons: [
          { src: 'icons/icon-72x72.jpg', sizes: "72x72" },
          { src: 'icons/icon-144x144.jpg', sizes: "144x144" },
        ]
        */
      },
    },
    `gatsby-plugin-offline`,
  ],
}
