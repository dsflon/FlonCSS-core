# FLONCSS 使用ガイド

## 基本的な使い方

FLONCSS は**ソースファイルとして配布**されます。これにより、アプリ側で `custom-media` などの設定をカスタマイズできます。

## セットアップ手順

### ステップ 1: FLONCSS をインストール

```bash
npm install floncss
```

### ステップ 2: テンプレートをコピー

```bash
npx floncss init ./src/styles
```

これにより、以下のファイルが作成されます:

**`./src/styles/` ディレクトリ:**

- `settings/` - デザイントークン
- `objects/` - 再利用可能なコンポーネント
- `global.css` - エントリーポイント

**プロジェクト直下:**

- `postcss.config.js` - PostCSS 設定 ✨

### ステップ 3: メイン CSS ファイルを作成

**方法 A: シンプル (推奨)**

`global.css` に全てのインポートが含まれているため、これだけをインポート:

```css
/* src/main.css */
@import "./styles/global.css";
```

`global.css` の中身:

```css
/* 1. 設定をインポート (custom-media.css を含む) */
@import url("./settings");

/* 2. FLONCSS コアをインポート */
@import url("floncss/core");

/* 3. オブジェクト */
@import url("./objects");
```

**方法 B: 細かく制御**

個別にインポートして順序を制御:

```css
/* src/main.css */

/* 1. 設定をインポート (custom-media.css が最初に含まれる) */
@import "./styles/settings";

/* 2. FLONCSS コアをインポート */
@import "floncss/core";

/* 3. オブジェクト */
@import "./styles/objects";
```

**重要**: `./settings` は内部で `custom-media.css` を最初にインポートします。

### ステップ 4: PostCSS を設定

`postcss.config.js` は自動的にプロジェクト直下に作成されています。

この設定には以下が含まれています:

- **`@floncss/` エイリアス**: カスタマイズした settings/objects へのパス解決
- **`floncss/` インポート**: node_modules の FLONCSS コアへのパス解決
- **custom-media-queries**: ブレークポイントの展開
- **nesting-rules**: CSS ネストのサポート

既存の `postcss.config.js` がある場合はスキップされるので、必要に応じて以下の設定を手動で統合してください:

```javascript
// postcss.config.js
const path = require("path");

module.exports = {
  plugins: {
    "postcss-import": {
      resolve(id, basedir) {
        // @floncss/* のインポートを解決
        if (id.startsWith("@floncss/")) {
          const relativePath = id.replace("@floncss/", "");
          return path.resolve(__dirname, "src/styles", relativePath);
        }
        // floncss/ のインポートを解決
        if (id.startsWith("floncss/")) {
          return require.resolve(id);
        }
        return id;
      },
    },
    "postcss-preset-env": {
      features: {
        "custom-media-queries": {
          preserve: false,
        },
        "nesting-rules": true,
      },
    },
  },
};
```

**注意**: `'src/styles'` の部分は `npx floncss init` で指定したディレクトリに応じて自動的に設定されます。

### `@floncss/` エイリアスの使い方

`postcss.config.js` で設定された `@floncss/` エイリアスを使って、カスタマイズした設定を直接インポートできます:

```css
/* 方法 A: 直接インポート */
@import "@floncss/settings/custom-media.css";
@import "@floncss/settings/colors.css";

/* 方法 B: 相対パスでインポート */
@import "./styles/settings/custom-media.css";
@import "./styles/settings/colors.css";
```

どちらの方法も同じファイルを参照しますが、`@floncss/` エイリアスを使うとパスの管理が簡単になります。

## カスタマイズ

### ブレークポイントをカスタマイズ

`./src/styles/settings/custom-media.css` を編集:

```css
@custom-media --media-sm only screen and (min-width: 576px);
@custom-media --media-md only screen and (min-width: 768px);
@custom-media --media-lg only screen and (min-width: 992px);
@custom-media --media-xl only screen and (min-width: 1200px);
```

### 色をカスタマイズ

`./src/styles/settings/colors.css` を編集:

```css
:root {
  --color-primary: #your-brand-color;
  --color-secondary: #your-secondary-color;
}
```

## アーキテクチャ

```
プロジェクト
├── postcss.config.js               # PostCSS 設定
├── src/
│   ├── main.css                    # エントリーポイント
│   └── styles/
│       ├── settings/
│       │   ├── custom-media.css    # ⚠️ 必ず最初にインポート
│       │   ├── colors.css          # カスタマイズ可能
│       │   └── ...
│       ├── objects/                # カスタマイズ可能
│       └── global.css              # settings + objects をまとめる
│
└── node_modules/floncss/
    ├── floncss/
    │   ├── core.css                # generic + base + trumps
    │   ├── generic/                # リセットCSS
    │   ├── base/                   # 基本要素
    │   ├── trumps/                 # ユーティリティクラス
    │   └── settings/
    │       └── custom-media.css    # デフォルト値(参考用)
└── templates/                      # コピー元テンプレート
```

## トラブルシューティング

### エラー: "Unknown at rule @custom-media"

`custom-media.css` がインポートされていないか、順序が間違っています。
必ず最初に `custom-media.css` をインポートしてください。

### エラー: "Cannot resolve 'floncss/core'"

PostCSS の import プラグインの設定を確認してください。
`node_modules` からの解決が有効になっている必要があります。

## なぜこの構成なのか？

1. **カスタマイズ性**: `@custom-media` はビルド時に展開されるため、アプリ側で定義する必要があります
2. **柔軟性**: ブレークポイントやデザイントークンを自由にカスタマイズ可能
3. **透明性**: ソースファイルとして配布されるため、内部構造が明確
