# FLONCSS アーキテクチャテスト

このディレクトリは新しいアーキテクチャのテストサンプルです。

## セットアップ

```bash
cd example
npm install
npm run build
```

## ファイル構造

```
example/
├── src/
│   ├── main.css              # エントリーポイント
│   └── styles/
│       ├── settings/
│       │   └── custom-media.css  # カスタムブレークポイント
│       └── global.css
├── package.json
└── postcss.config.js
```

## 検証項目

- [ ] `custom-media.css` が正しく展開される
- [ ] カスタムブレークポイントが反映される
- [ ] trumps のユーティリティクラスが生成される
- [ ] ビルドエラーが発生しない
