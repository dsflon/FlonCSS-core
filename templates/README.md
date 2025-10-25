# FLONCSS Templates

このディレクトリには、プロジェクトでカスタマイズ可能な FLONCSS のテンプレートファイルが含まれています。

## ディレクトリ構成

- **settings/** - デザイントークン(色、フォント、サイズなど)
- **objects/** - 再利用可能なオブジェクト/パターン
- **global.css** - メインのエントリーポイント
- **postcss.config.js** - PostCSS 設定 (プロジェクト直下にコピーされます)

## 使い方

### CLI でコピー (推奨)

```bash
npx floncss init ./src/styles
```

これにより、以下が作成されます:

- `./src/styles/` - settings, objects, global.css
- `./postcss.config.js` - プロジェクト直下に配置

### インポート

```css
/* あなたの main.css */
@import "./styles/global.css";
```

`global.css` には以下が含まれています:

1. カスタムメディアクエリ (`custom-media.css`)
2. FLONCSS コア
3. カスタム設定 (`settings/`)
4. オブジェクト (`objects/`)

### PostCSS 設定

`postcss.config.js` は自動的にプロジェクト直下にコピーされます。既存の設定がある場合はスキップされるので、必要に応じて手動で統合してください。
