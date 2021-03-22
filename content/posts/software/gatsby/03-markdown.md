---
title: Markdownで書く
date: 2021-02-09 03:00:00
cover: gatsby.png
series:
  title: スクラッチから始めるGatsby
  number: 3
---

## やること
- markdown で書けるようにする
- 素のmarkdown ではなく MDX を使う
  - component が使えるのでうれしい

## インストールと設定
ここではmarkdown-transfer ではなく、MDXのほうが便利なのでそちらを入れます。後で入れ替えるも二度手間ですし。とはいえしばらくはMDX独自の機能は使いません。

```sh
npm install --save gatsby-plugin-mdx @mdx-js/mdx @mdx-js/react
```

```js:title=gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.md`, `.mdx`]
      }
    }
  ]
}
```

拡張子は .md, .mdx 両方とも MDX扱いにしときます。

```md:title=src/pages/awesome.md
---
title: markdown is awesome
date: 2020-02-02
---

## THIS IS AWESOME MARKDOWN

- foo
- bar
  - baz
```

これで localhost:8000/awesome/ で表示されます。

## 文書は別場所に
マークアップ文書群は別に分けたいというのと、src/pages/に置いたままだと自動でいろいろ処理されてしまうため、自分でごにょごにょとできない（具体的には allMdx.nodes に入ってこない）という都合もあるので、content/posts/ 以下に置くことにします。

そのフォルダをソースとして読み出しますよ、というのを追加設定します。ソースファイルプラグインのインストールです。

```sh
npm install --save gatsby-source-filesystem
mkdir -p content/posts
mv src/pages/awesome.md content/posts
```

```js:title=gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/content/posts`,
      }
    ...
```

これで content/posts 以下のファイルも読み出せるようになりました。
ただし先程のように /awesome への書き出しは自動でやってくれなくなったので、自分で処理を実装する必要があります。

## マークアップ文書郡を取り出す
再び graphQL interface で遊びます。

gatsby-plugin-mdx を入れると、allMdx と mdx というクエリが使えるようになります。

```js:title=graphql
query MyQuery {
  allMdx {
    totalCount
    nodes {
      slug
      frontmatter {
        title
      }
      body
    }
  }
}
```

これでいろいろ取れます。

手順としては、

+ クエリで mdx リソースのノード群を取り出す
+ それぞれについてテンプレートファイルに当てはめページを作成する。

!!! fields.slug

```js:title=gatsby-node.js
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
    const { createNodeField } = actions
    //fmImagesToRelative(node)

    if (node.internal.type === `Mdx`) {
        const slug = createFilePath({ node, getNode })
        createNodeField({
            node,
            name: 'slug',
            value: slug
        })
    }
}
```


となります。ページ作成は、createPage() という関数が用意されてるので、それを使う形になります。
新規に gatsby-node.js を作成します：

```js:title=gatsby-node.js
const path = require(`path`)

exports.createPages = async ( { graphql, actions}) => {
    const { createPage } = actions
    const { data } = await graphql(`
    {
        allMdx {
            nodes {
                fields {
                  slug
                }
            }
        }
    }
    `)
    data.allMdx.nodes.map(node=> {
        console.log('create markdown page: ', node.fields.slug)

       createPage({
           path: node.slug,
           component: path.resolve('src/templates/post-template.js'),
           context: {
               slug: node.fields.slug,
           }
       })
    })
}
```

いくつかポイントがありますが、まず async/await は非同期処理のため（らしい）です。詳しくは菊名。
graphql()で mdx リソースのノードとそのタイトルやスラッグ、中身を取ってきてdataに入れます。
そして各ノードに対応するページを createPage()します。
その時、実際どのように出力するかを決める template component を指定し、そのテンプレートに node を context として渡します。

```js:title=src/template/post-template.js
import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"

export default function PostTempalte ( { pageContext }){
    const { node } = pageContext
    return (
        <div>
            <h2>{node.frontmatter.title}</h2>
            <MDXRenderer>
                {node.body}
            </MDXRenderer>
        </div>
    )
}
```

pageContext の中に node が入ってるので、その中からデータを取り出すわけですね。
node.body はいろいろ関数やらが組み込まれた形式になってるので MDXRenderer タグで囲ってあげて HTML に変換します。

これで localhost:8000/awesome で見られるようになりました。





## 連載記事
<Series title="スクラッチから始めるGatsby" display="card" current="3"/>
