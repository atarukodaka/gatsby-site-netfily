---
title: Gatsby version3 migration
date: 2021-03-07
cover: ./gatsby.png
---

 
## バージョンアップ
```
yarn workspace gatsby-theme-aksite upgrade-interactive --latest
```

全部選んでアップグレード。

## 修正

### import styles

 import styles from './foo.modules.css' だとなんか import エラーが出たので、修正。


 ```diff
 - import styles from './foo.modules.css'
 + import * as styles from './foo.module.css'
  ```

参考： <LinkExternal to="https://stackoverflow.com/questions/66500985/scss-file-does-not-contain-a-default-export-gatsby-and-sass">reactjs - scss file does not contain a default export (Gatsby and Sass) - Stack Overflow]</LinkExternal>

### gatsby-plugin-image
gatsby-image からこっちのプラグインに変えろと。npm i して gatsby-config.js の plugins[] に加えるのはいつもどおり。あとは、

- import を変える
- query を変える(...GatsyImageSharpFuild -> gatsgyImageData)
- 使用タグとパラメータを変える（下記）

```diff
- import Img from 'gatsby-image'
+ import { GatsbyImage } from 'gatsby-plugin-image'

.....

  allMdx {
    nodes {
      frontmatter {
        cover {
          childImageSharp {
-            fluid {
-              ...GatsbyImageSharpFluid
-            }
+            gatsbyImageData
          }
        ...


....

const Foo = (node) => )
-  <Img fluid={node.frontmatter.cover.childImageSharp.fulid}/>
+  <GatsbyImage image={node.frontmatter.cover.childImageSharp.gatsbyImageData} />
  .....
```


参考: [Migrating from gatsby\-image to gatsby\-plugin\-image \| Gatsby](https://www.gatsbyjs.com/docs/reference/release-notes/image-migration-guide/)