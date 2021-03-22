---
title: テーマ機能に切り分ける
date: 2021-03-06
cover: gatsby.png
series:
  title: スクラッチから始めるGatsby
  number: 6
---

## やること

- スターターからテーマに
- 機能的なものとコンテンツを切り分け

src/components/*.js などの機能と、content/posts/ などのコンテンツがごっちゃになっちゃうのは
管理上イヤンなので分ける。

## ディレクトリを用意
作業用ルートの下に、

- テーマ機能を作り込むパッケージ: ./gatsby-theme-aksite
- コンテンツを入れて実際に試す環境: ./site

の２つを作る：

### 作業用ルート

private: true を入れた package.json を作り、workspaces に 上記２つのディレクトリを指定：

```sh
yarn init -yp
```

```js{7-10}:title=package.json
{
  "name": "g-theme-root",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "private": true,
  "workspaces": [
    "site",
    "gatsby-theme-aksite"
  ]
}
```

### テーマディレクトリ(gatsby-theme-aksite)
作業用ルートの下にテーマディレクトリを作成し、yarn init で package.json を作り、'name' をディレクトリ名と合わせます。

```sh
mkdir gatsby-theme-aksite
cd gatsby-theme-aksite
yarn init -y 
vi package.json
```

```js{2}:title=gatsby-theme-aksite/package.json
{
    "name": "gatsby-theme-aksite",
    ...
```

### テスト環境ディレクトリ(site)
作業用ルートの下にテスト環境ディレクトリを作ります。
公式のシンプルなスターターを持ってくるのが一番ラクです。

```sh
cd ..
gatsby new site https://github.com/gatsbyjs/gatsby-starter-hello-world
```

前項と同様に "name"を変更します
```js{2}:title=site/package.json
{
    name: "site",
    ....
```    

作るテーマをプラグインとして組み込みます：
```sh
yarn workspace site add gatsby-theme-aksite
```

```js:title=site/gatsby-config.js
module.exports = {
  plugins: [`gatsby-theme-aksite`]
}
```

ここまででこんな感じのツリーになります：

```sh
.
├── gatsby-theme-aksite
│   ├── node_modules
│   └── package.json
├── node_modules
├── package.json
└── site
    ├── node_modules
    └── package.json
```


いよいよ開発環境を立ち上げます：

```sh
yarn workspace site develop
```

Hello world が出ました。ここからテーマの方に機能を加えていきます。


## 既存スターターからの変更点
基本的には、既存スターターの

- gatsby-*.js とsrc/ 以下を gatsby-theme-aksite に
- content/ と static/ を site に

持っていきます。ただし、いくつか変更する必要があります：

### path.resolve から require.resolve に

gatsby-node.js のテンプレートを参照する部分を、
サンプル通りに作ってると path.resolve() を使ってるはずですが、それだと
テーマの方を探してくれません。なので *require*.resolve() に変更します。

```js{6}:title=gatsby-theme-aksite/gatbsy-node.js
const createMdxPages = ({ nodes, actions }) => {
    const { createPage } = actions
        nodes.forEach(node => {
        createPage({
            path: node.fields.slug,
            component: require.resolve(`./src/template/post-template.js`),
            context: {
                slug: node.fields.slug,
            },
        })
    })
```

### source-filesystem

ソースを拾う部分でも、__dirname でパスを指定してしまうとテーマの方しか見ないので、
その部分は取り除きます。

```js{8}:title=gatsby-theme-aksite/gatsby-config.js
module.exports = {
  plugins: [
    .....
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `content/posts`,
      }
    },
```

### options 指定
テーマにオプションを渡す場合は、site の方の gatsby-config.js で指定します：

```js{5-7}:title=site/gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-theme-aksite`,
      options: {
        contentPath: `content/posts-test`
      }
    }
  ],
}
```

テーマの方でそれを拾うには、gatsby-config.js で exportするのをコールバック関数とし、
それの引数として options を受け取ります：

```js{1,8}:title=gatsby-theme-aksite/gatsby-config.js
module.exports = (options) => {
  return {
    plugins: [
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          name: `posts`,
          path: options.contentPath || `content/posts`,
        }
      },
```      

## 参考サイト
- [Converting a Starter to a Theme \| Gatsby](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/converting-a-starter/)
- [Gatsbyのtheme plugin作成のためのセットアップ \| Crudzoo](https://crudzoo.com/blog/gatsby-theme-setup)

## 連載記事
<Series title="スクラッチから始めるGatsby" display="text" current={6}/>


