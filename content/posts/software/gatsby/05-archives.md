---
title: 月別アーカイブ
date: 2021-02-11
cover: gatsby.png
series:
  title: スクラッチから始めるGatsby
  number: 5
---
## やること

- 月別のアーカイブを作る

## 日付情報を markdown にいれる

```md:title=content/awesome.md
---
title: markdown is awesome
date: 2020-02-02
---
...
```

date:を加えます。書式ですが、必ず YYYY-MM-DD にすること。2020-2-2 とか0を省くと文字列扱いになっておかしなことになります。

## gatsby-node.js をいじる

query でfrontmatter { date }も取ります。フォーマットも扱いやすいように指定したり日付でソートしたりします。

```js:title=gatsby-node.js
...
    const { data } = await graphql(`
    {
        allMdx (sort: {fields: frontmatter___date, order: DESC}) {
            nodes {
                frontmatter {
                    title
                    date(formatString: "YYYY-MM-DD")  // 加える
                }
...                
```
この日付情報をもとにコネコネします。やり方はいろいろあるんですが、

- 年月のユニークをとる
- それぞれについて期間を指定しテンプレートにアーカイブページを作らせる

という流れで行きます。

```js:title=gatsby-node.js
  const yearMonths = new Set(mdxPages.nodes.filter(v=>v.frontmatter.yearmonth).map(node=> node.frontmatter.yearmonth))
```

各 mdxリソースの年月の月初日 uniq を取ります。[2020-02-02, 2020-02-04, 2020-04-12] から [2020-02-01, 2020-04-01]を取り出すわけですね。

```js
const yearMonths = new Set(mdxPages.nodes.filter(v=>v.frontmatter.yearmonth).map(node=> node.frontmatter.yearmonth))
    yearMonths.forEach(node=>{
        const [year, month] = node.split('-').map(v=>parseInt(v))
        const fromDate = new Date(year, month - 1, 1)
        const nextMonth = new Date(year, month, 1)
        const toDate = new Date(nextMonth.getTime() -1)
        console.log(`monthly archive: ${year}/${month} (${items.length}) [${monthlyArchivePath(year, month)}]`)
        createPage({
            path: `/archives/${year}${month.toString().padStart(2, 0)}`,
            component: path.resolve(`./src/templates/archive-template.js`),
            context: {
                archive: 'monthly',
                year: year,
                month: month,
                fromDate: fromDate.toISOString(),
                toDate: toDate.toISOString(),
            }
        })        
    })
```

そしてその年月ごとにテンプレートを経由して月別アーカイブを作成します。

- date の getMonth() は０スタートの数字を返す:2020-02-01 なら 1
- padStart()はゼロパディングをしてくれる:　3 -> "03"
- toISOString() は YYYY-MM-DD 形式に変換

テンプレートはこんな感じに：

```js:title=src/templates/archive-template.js
import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout.js"

export const query = graphql`
    query($fromDate: Date!, $toDate: Date!){        
      allMdx(sort: {fields: frontmatter___date, order: DESC},
        filter: { frontmatter: { date: { gte: $fromDate, lt: $toDate } }} ) {
        nodes { 
          id
          excerpt(truncate: true)

          frontmatter {
            date(formatString: "YYYY-MM-DD"), title
          }        
          slug
        }
      }
    }
  `

export default function ArchiveTemplate({ data, pageContext }) {
  const { year, month } = pageContext
  console.log(`monthly archive template: ${year}/${month}`)
  
  return (
    <Layout>
        <h2>MONTHLY ARCHIVE: {year}/{month}</h2>
      {
        data.allMdx.nodes.map(node => (
            <div key={node.id}>
              <h3>{node.frontmatter.title}</h3>
              <div>{node.excerpt}</div>
              <Link to={node}>continue...</Link>
            </div>
          <PostExcerpt node={node} key={node.id} />
        ))
      }
    </Layout>
  )
}
export const PostExcerpt = ({ node }) => {
    return (
        <div>
            <h3 className={styles.title}>
              <Link to={'/' + node.slug}>{node.frontmatter.title || node.slug}</Link>
            </h3>

            <div>
                {node.excerpt}
                <Link to={'/' + node.slug}>...continue reading</Link>
            </div>
        </div>
    )
}
```

from, to で指定した期間の mdx node を取ってきて、タイトルと要旨(excerpt)を表示し、単体表示ページへのリンクも貼り付ける形です。

## 連載記事
<Series title="スクラッチから始めるGatsby" display="card" current="5"/>
