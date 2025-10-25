# FLONCSS

[![npm version](https://img.shields.io/npm/v/floncss.svg)](https://www.npmjs.com/package/floncss)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

https://floncss.dsflon.net/

Current FlonCSS version: 1.1.0

**FLONCSS**は、最小限の utility-first CSS と ITCSS ベースの style 設計を組み合わせたハイブリッド CSS フレームワークです。デザイナーとエンジニアにとって、品質の安定性とより自由なスタイリングを実現します。

## 特徴

- 🎨 **ハイブリッドアプローチ** - Utility-first と ITCSS の良いとこ取り
- 🔧 **高いカスタマイズ性** - デザイントークンから細かく調整可能
- 📦 **モジュラー構造** - 必要な部分だけを選択可能
- 🚀 **PostCSS ベース** - モダンなビルドツールとシームレスに統合
- 💪 **型安全** - カスタムプロパティとメディアクエリの一元管理

## インストール

```bash
npm install floncss
```

## 使い方

**重要**: FLONCSS は **ソースファイルとして配布** されます。`@custom-media` などの設定をアプリ側でカスタマイズできるようにするためです。

### クイックスタート

#### ステップ 1: テンプレートを初期化

```bash
npx floncss init ./src/styles
```

これにより、以下が作成されます:

**`./src/styles/` ディレクトリ:**

- `settings/custom-media.css` - ブレークポイント設定
- `settings/` - デザイントークン(色、フォント、サイズなど)
- `objects/` - 再利用可能なオブジェクト/パターン
- `global.css` - エントリーポイント

**プロジェクト直下:**

- `postcss.config.js` - PostCSS 設定 ✨

#### ステップ 2: CSS ファイルでインポート

**シンプルな方法 (推奨):**

```css
/* src/main.css */
@import "./styles/global.css";
```

`global.css` には全てのインポートが正しい順序で含まれています。

**カスタム方法:**

個別にインポートして細かく制御することも可能:

```css
/* src/main.css */

/* 1. 設定をインポート (custom-media.css が最初に含まれる) */
@import "./styles/settings";

/* 2. FLONCSS コアをインポート */
@import "floncss/floncss/core.css";

/* 3. オブジェクト */
@import "./styles/objects";
```

**注意**: `./settings` は内部で `custom-media.css` を最初にインポートするため、正しい順序が保証されます。

#### ステップ 3: PostCSS を設定

`postcss.config.js` は自動的にプロジェクト直下に作成されます。

この設定には以下が含まれています:

- **`@floncss/` エイリアス**: カスタマイズした settings/objects へのパス解決
- **`floncss/` インポート**: node_modules の FLONCSS コアへのパス解決
- **custom-media-queries**: ブレークポイントの展開
- **nesting-rules**: CSS ネストのサポート

既存の `postcss.config.js` がある場合はスキップされるので、以下の設定を手動で統合してください:

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
          preserve: false, // @custom-media を展開
        },
        "nesting-rules": true,
      },
    },
  },
};
```

#### ステップ 4: カスタマイズ

ブレークポイントをカスタマイズ:

```css
/* ./src/styles/settings/custom-media.css */
@custom-media --media-sm only screen and (min-width: 576px);
@custom-media --media-md only screen and (min-width: 768px);
@custom-media --media-lg only screen and (min-width: 992px);
@custom-media --media-xl only screen and (min-width: 1200px);
```

色をカスタマイズ:

```css
/* ./src/styles/settings/colors.css */
:root {
  --color-primary: #your-brand-color;
  --color-secondary: #your-secondary-color;
}
```

### 個別インポート(上級者向け)

必要な部分だけを選択してインポート:

```css
/* main.css */
@import "./settings/custom-media.css"; /* custom-media.css は最初 */
@import "floncss/generic/reset.css";
@import "floncss/trumps/displays.css";
/* 必要な部分だけ選択 */
```

または、settings 全体をインポート (custom-media.css が最初に含まれる):

```css
/* main.css */
@import "./settings"; /* custom-media.css が最初にインポートされる */
@import "floncss/trumps/displays.css";
```

詳細は [USAGE.md](./USAGE.md) を参照してください。

## プロジェクト構成

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
│       └── global.css
│
└── node_modules/floncss/
    ├── floncss/
    │   ├── core.css                # generic + base + trumps
    │   ├── generic/                # リセットCSS
    │   ├── base/                   # 基本要素
    │   ├── trumps/                 # ユーティリティクラス
    │   └── settings/
    │       └── custom-media.css    # デフォルト値(参考用)
    └── templates/                  # コピー元テンプレート
```

## PostCSS 設定

FLONCSS を使用するには、プロジェクトで PostCSS の設定が必要です:

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    "postcss-import": {},
    "postcss-preset-env": {
      features: {
        "custom-media-queries": {
          preserve: false, // @custom-media を展開
        },
        "nesting-rules": true,
      },
    },
  },
};
```

## なぜソースファイルとして配布？

FLONCSS は **ビルド済み CSS ではなく、ソースファイルとして配布** されます。理由:

1. **カスタマイズ性**: `@custom-media` (ブレークポイント)はビルド時に展開されるため、アプリ側で定義する必要があります
2. **柔軟性**: ブレークポイントやデザイントークンを自由にカスタマイズ可能
3. **透明性**: ソースファイルとして配布されるため、内部構造が明確

## ビルド

FLONCSS の開発者向け:

```bash
# ソースファイルをそのまま使用するため、ビルドは不要
npm run build
```

## CLI コマンド

```bash
npx floncss init [directory]  # テンプレートを初期化
```

例:

```bash
npx floncss init              # ./floncs に初期化
npx floncss init ./styles     # ./styles に初期化
```

## ITCSS レイヤー構造

FLONCSS は ITCSS(Inverted Triangle CSS)アーキテクチャに基づいています:

1. **Settings** - グローバル変数、デザイントークン
2. **Generic** - リセット、normalize
3. **Base** - HTML 要素のデフォルトスタイル
4. **Objects** - デザインパターン、レイアウト
5. **Trumps** - ユーティリティクラス(最優先)

## ライセンス

MIT

## リンク

- [公式サイト](https://floncss.dsflon.net/)
- [ドキュメント](https://floncss.dsflon.net/)

---

Made with ❤️ for designers and developers
