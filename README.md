# FlonCSS

https://floncss.dsflon.net/

**ハイブリッド CSS フレームワーク** - 最小限の utility-first と ITCSS ベースの CSS 設計

FlonCSS は、ユーティリティクラスとコンポーネントベース設計を組み合わせた、柔軟でスケーラブルな CSS フレームワークです。

## 特徴

- 🎨 **ITCSS ベースのアーキテクチャ**: 明確な階層構造で保守性の高い CSS
- 🔧 **カスタマイズ可能**: デザイントークンを自由にカスタマイズ
- 📦 **ユーティリティファースト**: 最小限のユーティリティクラスを内蔵
- 🎯 **レスポンシブ対応**: ブレークポイントごとのユーティリティを選択可能
- 💡 **PostCSS**: 最新の CSS 機能を使用可能
- 📝 **型安全**: CSS 変数によるデザイントークン管理

## インストール

```bash
npm install floncss
```

## クイックスタート

### 1. テンプレートを初期化

```bash
// プロジェクト直下に 'floncss' ディレクトリを構成
npx floncss init

// ディレクトリを指定して構成する場合
npx floncss init ./path/to/floncss
```

これにより以下が作成されます:

- `./floncss/` - カスタマイズ可能なテンプレート（settings, objects, components など）
- `./postcss.config.js` - PostCSS 設定（プロジェクト直下）

### 4. ビルド

```bash
npx postcss path/to/global.css -o dist/global.css
```

## プロジェクト構造

```
your-project/
├── path/to/
│   ├── settings/      # デザイントークン（色、フォント、ブレークポイント）
│   ├── generic/       # リセットCSS(任意で変更してください)
│   ├── base/          # 基本要素スタイル(任意で変更してください)
│   ├── objects/       # 再利用可能なUIパーツ(任意で変更してください)
│   ├── components/    # プロジェクト固有のコンポーネント
│   └── global.css     # エントリーポイント
├── postcss.config.js
└── package.json

node_modules/
└── floncss/
    ├── core/              # FlonCSSコア（Base, Trumps）
    │   ├── base/          # 基本要素スタイル
    │   ├── trumps/        # ユーティリティクラス
    │   └── index.css
    └── templates/         # カスタマイズ可能なテンプレート
```

## ITCSS アーキテクチャ

FlonCSS は**ITCSS（Inverted Triangle CSS）**に基づいて設計されています。

### レイヤー構造（詳細度: 低 → 高）

1. **Settings** - CSS 変数、デザイントークン
2. **Generic** - ブラウザリセット（FlonCSS コアに含む）
3. **Base** - HTML 要素のデフォルトスタイル（FlonCSS コアに含む）
4. **Objects** - 再利用可能な UI パーツ（カスタマイズ可能）
5. **Components** - プロジェクト固有のコンポーネント（カスタマイズ可能）
6. **Trumps** - ユーティリティクラス（FlonCSS コアに含む）

詳細は [templates/README.md](./templates/README.md) を参照してください。

## 使い方

### デザイントークンのカスタマイズ

```css
/* path/to/settings/colors.css */
:root {
  --color-primary: #007bff;
  --color-secondary: #6c757d;
}
```

### ブレークポイントの設定

```css
/* path/to/settings/custom-media.css */
@custom-media --media-sm (min-width: 576px);
@custom-media --media-md (min-width: 768px);
@custom-media --media-lg (min-width: 992px);
@custom-media --media-xl (min-width: 1200px);
```

### オブジェクトの作成

```css
/* path/to/objects/button.css */
.o-button\:primary {
  background: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-base);
}
```

### コンポーネントの作成

```css
/* path/to/components/header.css */
.c-header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: var(--color-000);
  height: var(--height-header);
}
```

### レスポンシブユーティリティの選択

```css
/* path/to/global.css */

/* 必要なブレークポイントのみコメント解除 */
@import url("floncss/trumps/media-md");
@import url("floncss/trumps/media-lg");
/* @import url("floncss/trumps/media-sm"); */
/* @import url("floncss/trumps/media-xl"); */
```

### HTML での使用

```html
<!-- ユーティリティクラス -->
<div class="mt:lg pd:md flex">
  <p class="text:center line-height:lg">テキスト</p>
</div>

<!-- オブジェクト -->
<button class="o-button:primary">ボタン</button>

<!-- コンポーネント -->
<div class="c-header">
  <h2>ヘッダータイトル</h2>
  <nav>ナビゲーション</nav>
</div>

<!-- レスポンシブ -->
<div class="block flex@md">レスポンシブレイアウト</div>
```

## ユーティリティクラス

FlonCSS コアには以下のユーティリティクラスが含まれています:

### Display & Layout

- **Display**: `block`, `inline-block`, `inline`, `flex`, `inline-flex`, `table`, `inline-table`, `grid`, `inline-grid`, `contents`, `hidden`, `visible`
- **Flexbox**:
  - **Align Items**: `items:inherit`, `items:normal`, `items:stretch`, `items:center`, `items:start`, `items:end`, `items:flex-start`, `items:flex-end`
  - **Align Self**: `self:inherit`, `self:baseline`, `self:auto`, `self:center`, `self:flex-start`, `self:flex-end`
  - **Justify Content**: `justify:inherit`, `justify:normal`, `justify:stretch`, `justify:between`, `justify:around`, `justify:evenly`, `justify:center`, `justify:start`, `justify:end`, `justify:flex-start`, `justify:flex-end`
  - **Justify Self**: `justify-self:inherit`, `justify-self:baseline`, `justify-self:auto`, `justify-self:center`, `justify-self:start`, `justify-self:end`
  - **Flex Wrap**: `flex-wrap`, `flex-wrap-reverse`, `flex-wrap-nowrap`
  - **Flex Direction**: `direction:column`, `direction:column-reverse`, `direction:row`, `direction:row-reverse`
  - **Flex Shrink**: `shrink:1`, `shrink:0`
  - **Flex**: `flex:1`, `flex:auto`, `flex:initial`, `flex:none`
  - **Order**: `order:1`～`order:12`, `order:first`, `order:last`, `order:none`
- **Grid**:
  - **Grid Flow**: `grid-flow:row`, `grid-flow:col`, `grid-flow:dense`, `grid-flow:row-dense`, `grid-flow:col-dense`
  - **Grid Columns**: `grid-cols:1`～`grid-cols:12`, `grid-cols:none`, `grid-cols:subgrid`
  - **Grid Rows**: `grid-rows:1`～`grid-rows:12`, `grid-rows:none`, `grid-rows:subgrid`
  - **Col Span**: `col-span:auto`, `col-span:1`～`col-span:11`
  - **Row Span**: `row-span:auto`, `row-span:1`～`row-span:11`

### Spacing

- **Margin**: `mt`, `mt:2xl`, `mt:xl`, `mt:lg`, `mt:md`, `mt:sm`, `mt:xs`, `mt:2xs`, `mt:none`, `mt:auto`
  - 同様に `mr`, `mb`, `ml`, `mx`, `my`, `mg` も利用可能
- **Padding**: `pt`, `pt:2xl`, `pt:xl`, `pt:lg`, `pt:md`, `pt:sm`, `pt:xs`, `pt:2xs`, `pt:none`
  - 同様に `pr`, `pb`, `pl`, `px`, `py`, `pd` も利用可能
- **Gap**: `gap`, `gap:2xl`, `gap:xl`, `gap:lg`, `gap:md`, `gap:sm`, `gap:xs`, `gap:2xs`, `gap:3xs`, `gap:none`
  - `row-gap` も同様のサイズ指定が可能

### Typography

- **Text Align**: `text:left`, `text:center`, `text:right`, `text:justify`
- **Vertical Align**: `align:inherit`, `align:baseline`, `align:sub`, `align:super`, `align:text-top`, `align:text-bottom`, `align:top`, `align:middle`, `align:bottom`
- **Line Height**: `line-height`, `line-height:xl`, `line-height:lg`, `line-height:md`, `line-height:sm`, `line-height:none`
  - レガシー版: `lh`, `lh:2xl`, `lh:xl`, `lh:lg`, `lh:md`, `lh:sm`, `lh:xs`, `lh:2xs`, `lh:none`
- **White Space**: `white-space:normal`, `white-space:nowrap`, `white-space:pre`, `white-space:pre-line`, `white-space:break-spaces`
- **Letter Spacing**: `letter-spacing`, `letter-spacing:xl`, `letter-spacing:lg`, `letter-spacing:md`, `letter-spacing:sm`, `letter-spacing:none`

### Colors

- **Text Color**:
  - メインカラー: `color:primary`, `color:primary-light`, `color:primary-dark`, `color:secondary`, `color:secondary-light`, `color:secondary-dark`, `color:tertiary`, `color:quaternary` など
  - ニュートラル: `color:900`, `color:800`, `color:700`, `color:600`, `color:500`, `color:400`, `color:300`, `color:200`, `color:100`, `color:000`
  - その他: `color:red`, `color:red-light`, `color:red-dark`, `color:green`, `color:blue` など
- **Background**:
  - メインカラー: `bg-color:primary`, `bg-color:secondary` など（上記と同様の接尾辞）
  - ニュートラル: `bg-color:900`～`bg-color:000`
  - その他: `bg-color:red`, `bg-color:green`, `bg-color:blue` など

### Borders

- **Border**: `border`, `border:top`, `border:right`, `border:bottom`, `border:left`
- **Border Width**: `border-width`, `border-width:xl`, `border-width:lg`, `border-width:md`, `border-width:sm`
  - `.border` と組み合わせて使用: `border.border-width:lg`
  - 方向指定: `.border:top.border-width:lg` など
- **Border Style**: `border-style:solid`, `border-style:dotted`, `border-style:dashed`
- **Border Color**: `border-color:primary`, `border-color:900`～`border-color:000`, `border-color:red` など
- **Border Radius**: `radius`, `radius:xl`, `radius:lg`, `radius:md`, `radius:sm`, `radius:none`

### Columns (Flex レイアウト)

- **Columns**: `.cols` クラス内で `cols:1`～`cols:12`, `cols:flex` を使用
  - 12 カラムの Flex ベースグリッドシステム

### Fonts

- **Font Family**: `font:primary`, `font:secondary`
- **Font Size**: `font:base`, `font:2xl`, `font:xl`, `font:lg`, `font:md`, `font:sm`, `font:xs`, `font:2xs`
- **Font Weight**: `font:300`, `font:normal`, `font:500`, `font:600`, `font:bold`, `font:900`
- **Font Style**: `font:itaric`

### レスポンシブバリアント

すべてのユーティリティクラスに以下のレスポンシブ接尾辞を付けることができます:

- `@sm` - 576px 以上
- `@md` - 768px 以上
- `@lg` - 992px 以上
- `@xl` - 1200px 以上

例: `block@md`, `flex@lg`, `mt:lg@xl`

## package.json の設定例

```json
{
  "scripts": {
    "build:css": "postcss src/main.css -o dist/main.css",
    "watch:css": "postcss src/main.css -o dist/main.css --watch"
  },
  "dependencies": {
    "floncss": "^1.0.0"
  },
  "devDependencies": {
    "postcss": "^8.5.3",
    "postcss-cli": "^11.0.1",
    "postcss-import": "^16.1.0",
    "postcss-mixins": "^11.0.3",
    "postcss-preset-env": "^10.1.5"
  }
}
```

## ドキュメント

- [Templates README](./templates/README.md) - テンプレートの詳細
- [Settings](./templates/settings/README.md) - デザイントークン
- [Generic](./templates/generic/README.md) - リセット CSS
- [Base](./templates/base/README.md) - 基本要素
- [Objects](./templates/objects/README.md) - UI パーツ
- [Components](./templates/components/README.md) - コンポーネント

## ライセンス

MIT
