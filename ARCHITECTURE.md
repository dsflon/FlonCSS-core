# アーキテクチャ変更: カスタムメディアクエリ対応

## 問題

`@custom-media` は PostCSS のビルド時に展開されるため、事前ビルドされた CSS ではユーザー側でブレークポイントをカスタマイズできない問題がありました。

## 解決策

**FLONCSS をソースファイルとして配布**し、ユーザーのプロジェクト側でビルドしてもらう方式に変更しました。

## 変更内容

### 1. ビルドプロセスの削除

- ✅ `dist/` ディレクトリへのビルドを廃止
- ✅ ソースファイル(`floncss/`)をそのまま配布

### 2. `custom-media.css` の配置

```
floncss/settings/custom-media.css   # デフォルト値(参考用)
templates/settings/custom-media.css # ユーザーがコピーして使用
```

### 3. インポート順序の明確化

ユーザーは以下の順序でインポート:

```css
/* 1. カスタムメディアクエリ(必須) */
@import "./styles/settings/custom-media.css";

/* 2. FLONCSSコア */
@import "floncss/core";

/* 3. アプリ固有の設定 */
@import "./styles/global.css";
```

### 4. ファイルの変更

#### `floncss/trumps/index.css`

- ❌ 削除: `@import url("@floncss/settings/custom-media");`
- 理由: アプリ側で先にインポートするため

#### `floncss/trumps/media-*.css` (sm, md, lg, xl)

- ❌ 削除: `@import url("@floncss/settings/custom-media");`
- 理由: 同上

#### `templates/global.css`

- ✅ 追加: `custom-media.css` を最初にインポート
- ✅ コメント追加: インポート順序の重要性を明記

#### `templates/settings/index.css`

- ❌ 削除: `custom-media.css` のインポート
- 理由: `global.css` で個別にインポートするため

#### `package.json`

- ✅ 変更: `main` フィールドを `floncss/core` に
- ✅ 変更: `exports` を更新してソースファイルを公開
- ✅ 変更: `build` スクリプトを削除

## ユーザーの使い方

### セットアップ

```bash
npm install floncss
npx floncss init ./src/styles
```

### インポート

```css
/* src/main.css */
@import "./styles/settings/custom-media.css";
@import "floncss/core";
@import "./styles/global.css";
```

### カスタマイズ

```css
/* src/styles/settings/custom-media.css */
@custom-media --media-sm only screen and (min-width: 576px);
@custom-media --media-md only screen and (min-width: 768px);
@custom-media --media-lg only screen and (min-width: 992px);
@custom-media --media-xl only screen and (min-width: 1200px);
```

## メリット

1. ✅ **完全なカスタマイズ性**: ブレークポイントを自由に変更可能
2. ✅ **透明性**: ソースコードが直接見える
3. ✅ **柔軟性**: 必要な部分だけインポート可能
4. ✅ **標準的**: PostCSS のベストプラクティスに準拠

## デメリットと対策

### デメリット

- ユーザー側で PostCSS の設定が必要

### 対策

- ドキュメントで詳細に説明
- CLI でテンプレートを自動生成
- 使用例を豊富に用意

## 関連ドキュメント

- [USAGE.md](./USAGE.md) - 詳細な使用方法
- [README.md](./README.md) - クイックスタート
- [templates/global.css](./templates/global.css) - インポート例
