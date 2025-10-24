# FLONCSS 公開ガイド

## パッケージ構成

FLONCSS はハイブリッド方式でパッケージ化されています:

### 📦 パッケージに含まれるもの

- **floncss/** - ソースファイル(全て)

  - `generic/` - コア: リセット CSS
  - `trumps/` - コア: ユーティリティクラス
  - `settings/` - カスタマイズ可能: デザイントークン
  - `base/` - カスタマイズ可能: 基本要素
  - `objects/` - カスタマイズ可能: 再利用パターン
  - `core.css` - generic + trumps のみのエントリーポイント
  - `global.css` - 全部入りのエントリーポイント

- **dist/** - ビルド済みファイル

  - `core.css` - generic + trumps のビルド版
  - `floncss.css` - 全部入りのビルド版

- **templates/** - 初期化用テンプレート

  - `settings/` - デザイントークンのテンプレート
  - `base/` - 基本要素のテンプレート
  - `objects/` - オブジェクトのテンプレート
  - `custom.css` - カスタマイズエントリーポイント

- **cli.js** - 初期化コマンド

## npm パッケージとして公開

### 1. npm アカウントでログイン

```bash
npm login
```

### 2. パッケージ情報の確認

`package.json` の以下の項目を確認・更新してください:

```json
{
  "name": "floncss",
  "version": "1.0.0",
  "description": "ハイブリッドCSSフレームワーク - 最小限のutility-first CSSとITCSSベースのstyle設計",
  "author": "あなたの名前",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/floncss"
  }
}
```

### 3. ビルドの実行

公開前に必ずビルドを実行:

```bash
npm run build
```

これにより `dist/` ディレクトリに以下が生成されます:

- `dist/core.css` - コア部分のみ
- `dist/floncss.css` - 完全版

### 4. パッケージ内容の確認

```bash
npm pack --dry-run
```

このコマンドで、実際に公開されるファイルを確認できます。

### 5. 公開

```bash
npm publish
```

初回公開の場合は、パッケージ名が利用可能か確認してください。

### 6. バージョンアップ

次回以降のリリース:

```bash
# パッチバージョンアップ (1.0.0 → 1.0.1)
npm version patch

# マイナーバージョンアップ (1.0.0 → 1.1.0)
npm version minor

# メジャーバージョンアップ (1.0.0 → 2.0.0)
npm version major

# 公開
npm publish
```

## ユーザーの使い方

### インストール

```bash
npm install floncss
```

### 使用方法 1: 完全版(簡単)

```css
/* main.css */
@import "floncss";
```

### 使用方法 2: コア + カスタマイズ(推奨)

```bash
# テンプレートを初期化
npx floncss init ./styles
```

```css
/* main.css */
@import "floncss/dist/core.css";
@import "./styles/custom.css";
```

### 使用方法 3: ビルド済みファイルを直接使用

```html
<!-- HTML -->
<link rel="stylesheet" href="node_modules/floncss/dist/floncss.css" />
```

または

```html
<link rel="stylesheet" href="node_modules/floncss/dist/core.css" />
<link rel="stylesheet" href="your-custom.css" />
```

## 開発ワークフロー

### ローカルテスト

パッケージを公開する前に、ローカルでテスト:

```bash
# パッケージをビルド
npm run build

# パッケージをローカルでリンク
npm link

# 別のプロジェクトで
cd /path/to/test-project
npm link floncss
```

### 継続的な開発

1. `floncss/` 配下のファイルを編集
2. `npm run build` でビルド
3. テストプロジェクトで確認
4. バージョンアップ & 公開

## トラブルシューティング

### ビルドエラーが出る場合

PostCSS の依存関係を確認:

```bash
npm install
npm run build
```

### パッケージ名が既に使われている場合

`package.json` の `name` を変更するか、スコープ付きパッケージにする:

```json
{
  "name": "@yourname/floncss"
}
```

### CLI が動作しない場合

`cli.js` に実行権限があるか確認:

```bash
chmod +x cli.js
```

## チェックリスト

公開前に確認:

- [ ] `package.json` の情報が正しい
- [ ] `npm run build` が成功する
- [ ] `dist/` ディレクトリにファイルが生成されている
- [ ] `README.md` が充実している
- [ ] `npm pack --dry-run` で内容を確認
- [ ] ローカルで `npm link` してテスト
- [ ] バージョン番号が正しい
- [ ] ライセンスが設定されている

## 参考リンク

- [npm 公式ドキュメント](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [セマンティックバージョニング](https://semver.org/lang/ja/)
