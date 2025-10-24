# FLONCSS Templates

このディレクトリには、プロジェクトでカスタマイズ可能な FLONCSS のテンプレートファイルが含まれています。

## ディレクトリ構成

- **settings/** - デザイントークン(色、フォント、サイズなど)
- **objects/** - 再利用可能なオブジェクト/パターン
- **custom.css** - メインのエントリーポイント

## 使い方

1. これらのファイルをプロジェクトにコピー
2. 必要に応じてカスタマイズ
3. `custom.css` をメイン CSS ファイルからインポート

```css
/* あなたのmain.css */
@import "floncss/dist/core.css"; /* コア部分(generic + base + trumps) */
@import "./path/to/custom.css"; /* カスタマイズ部分 */
```

または `global.css` から全体をインポート:

```css
@import "floncss"; /* global.css をインポート */
```
