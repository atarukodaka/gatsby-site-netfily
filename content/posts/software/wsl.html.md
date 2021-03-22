---
title: WSL - Windows Subsytem Linux 開発環境
category: software
date: 2019-02-25
---

## WSL を有効化する
（省略）


## アップデート、必要ツールのインストール
```
sudo apt update
sudo apt upgrade
sudo apt install make curl
```

### ssh
```
ssh-keygen -t rsa
eval `ssh-agent`
ssh-add ~/.ssh/id_rsa
```

github のサイトで id_rsa.pub を登録。

### init files
```sh
git clone git@github.com:atarukodaka/dotfiles.git
cd dotfiles
make
```

### Nodejs のインストール
nvm を使います。

```sh
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
nvm -v
nvm i stable
node -v
npm i yarn -g
```

### ruby (rbenv) のインストール
```sh
sudo apt install autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm5 libgdbm-dev
git clone https://github.com/sstephenson/rbenv.git ~/.rbenv
git clone https://github.com/sstephenson/ruby-build.git ~/.rbenv/plugins/ruby-build
rbenv install 2.4.5
rbenv rehash
rbenv global 2.4.5
rbenv versions
gem install bundle
```

## DB

使うのであれば。

```sh
sudo apt install postgresql libpq-dev
sudo apt install sqlite libsqlite3-dev
```

### vscode

- theme: solarize
- minimap 非表示
