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

### 方法 1: 完全版を使う(最も簡単)

```css
/* main.css */
@import "floncss";
```

これで全ての機能(settings, generic, base, objects, trumps)が利用可能になります。

### 方法 2: コア + カスタマイズ(推奨)

コア部分(generic + base + trumps)のみをインポートし、カスタマイズ可能な部分は自分のプロジェクトで管理します。

#### ステップ 1: テンプレートを初期化

```bash
npx floncss init ./styles
```

これにより、`./styles` ディレクトリに以下が作成されます:

- `settings/` - デザイントークン(色、フォント、サイズなど)
- `objects/` - 再利用可能なオブジェクト/パターン
- `custom.css` - エントリーポイント

#### ステップ 2: CSS ファイルでインポート

```css
/* main.css */
@import "floncss/dist/core.css"; /* コア部分(generic + base + trumps) */
@import "./styles/custom.css"; /* カスタマイズ部分 */
```

#### ステップ 3: カスタマイズ

`./styles/settings/` でデザイントークンを編集:

```css
/* ./styles/settings/colors.css */
:root {
  --color-primary: #your-brand-color;
  --color-secondary: #your-secondary-color;
}
```

### 方法 3: 個別インポート(上級者向け)

必要な部分だけを選択してインポート:

```css
/* main.css */
@import "floncss/generic/reset.css";
@import "floncss/settings/colors.css";
@import "floncss/trumps/displays.css";
/* 必要な部分だけ選択 */
```

## プロジェクト構成

```
floncss/
├── settings/       カスタマイズ可能: デザイントークン
│   ├── colors.css
│   ├── fonts.css
│   ├── sizes.css
│   └── ...
├── generic/        コア: リセットCSS
│   └── reset.css
├── base/           コア: 基本要素
│   └── base.css
├── objects/        カスタマイズ可能: 再利用パターン
│   ├── box.css
│   ├── text.css
│   └── ...
├── trumps/         コア: ユーティリティクラス
│   ├── colors/
│   ├── displays/
│   ├── gaps/
│   └── ...
├── core.css        generic + base + trumps
└── global.css      全部入り
```

## PostCSS 設定

プロジェクトで PostCSS を使用する場合:

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    "postcss-import": {},
    "postcss-preset-env": {
      features: {
        "custom-media-queries": true,
        "nesting-rules": true,
      },
    },
  },
};
```

## ビルド

パッケージ開発者向け:

```bash
npm run build        # コアと完全版をビルド
npm run build:core   # コア部分のみビルド
npm run build:full   # 完全版をビルド
```

## CLI コマンド

```bash
npx floncss init [directory]  # テンプレートを初期化
```

例:

```bash
npx floncss init              # ./floncss-custom に初期化
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
