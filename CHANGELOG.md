# Changelog

FlonCSS の注目すべき変更をこのファイルに記録します。
フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に、バージョニングは [Semantic Versioning](https://semver.org/lang/ja/) に準拠します。

## [3.1.0] - 2026-07-27

### 変更（Changed）

- **peerDependencies を再び自動インストール対象に**（`peerDependenciesMeta` の `optional: true` を撤回）
  - v3.0.0 ではプリビルド CSS だけを使う利用者に PostCSS 一式を強制しないため、全 peerDependencies を optional 扱いにしていました
  - 実際にはプリビルド CSS のみを使う利用者はごく少数で、大半はテンプレートワークフロー（PostCSS 一式が必須）を利用するため、`npm install floncss` だけで必要なツールチェーンが揃う体験を優先し直しました
  - **移行方法**: 特に対応不要です。`npm install -D postcss postcss-cli postcss-import postcss-mixins postcss-preset-env postcss-import-resolver cssnano` を既に手動実行済みの環境には影響ありません。プリビルド CSS だけで PostCSS が不要な場合は `npm install floncss --omit=peer` 等でスキップできます

## [3.0.0] - 2026-07-04

### 破壊的変更（Breaking Changes）

- **`.flex` / `.inline-flex` の暗黙のデフォルト gap を廃止**
  - v2 では `display: flex` 系のユーティリティに `column-gap: var(--gap-base)`（デフォルト 40px）が暗黙に適用されていましたが、v3 では `.grid` / `.cols` と同じく `0` になりました
  - レスポンシブ grid 変形（`grid@md` など）の暗黙デフォルト gap（v2: `gap: var(--gap-base)`）も同様に `0` になりました
  - **移行方法**: 従来の見た目を維持するには、コンテナに `gap` クラス（= `gap-base`）を追加してください
  - あわせて `row-gap` 未指定時のフォールバックが `0` から `column-gap` の値に変わりました（CSS の `gap` ショートハンドと同じ感覚）
  - コンテナのデフォルト値は `:where()`（詳細度 0）で宣言されるため、`gap:*` / `row-gap:*` ユーティリティは読み込み順やブレークポイントの組み合わせ（例: `flex@md gap:lg`）に関係なく必ず優先されます
- **peerDependencies が自動インストールされなくなりました（すべて optional 扱い）**
  - プリビルド CSS だけを使う場合に PostCSS ツールチェーンを強制しないための変更です
  - **移行方法**: テンプレートワークフローを使う場合は `npm install -D postcss postcss-cli postcss-import postcss-mixins postcss-preset-env postcss-import-resolver cssnano` を実行してください
- **`floncss/trumps/*` 配下の個別ファイル単体でのインポートは動作を保証対象外に**
  - trumps 内のファイルは相互に連携して動作します。サポートされるエントリーポイントは `floncss/core` / `floncss/trumps` / `floncss/trumps/media-*` です
- **レガシー `lh:*` クラスを削除**
  - `lh` / `lh:none` / `lh:sm`〜`lh:2xl` などを削除しました。`lh:2xl` / `lh:xs` / `lh:2xs` は参照先の CSS 変数が存在せず、v2 でも機能していませんでした
  - **移行方法**: `line-height:*` クラスに置き換えてください
- **テンプレートの `global.css` がカスケードレイヤー（`@layer`）ベースに**
  - `@layer settings, generic, base, objects, components, trumps;` を宣言し、ITCSS のレイヤー順序を import 順ではなく言語仕様で担保します
  - 既存プロジェクトにコピー済みのテンプレートには影響しません（新規 `init` から適用）
  - **注意**: レイヤーに属さない CSS はすべてのレイヤーより優先されます。カスタム CSS は `components` などのレイヤーに入れてください
- **テンプレートの Google Fonts `@import` をデフォルト無効化**
  - レンダリングブロックとプライバシー（GDPR 等）への配慮のため。Web フォントが必要な場合は `settings/fonts.css` でコメント解除してください

### 非推奨（Deprecated）

- **`.cols`（Flex ベース 12 カラムシステム）を非推奨化**
  - 動作は維持されますが、CSS Grid ベースの `grid` / `grid-cols:N` / `col-span:N` への移行を推奨します。将来のメジャーバージョンで削除される可能性があります

### 追加（Added）

- **プリビルド CSS を同梱** — `dist/floncss.css` / `dist/floncss.min.css`
  - `<link rel="stylesheet" href="https://unpkg.com/floncss@3/dist/floncss.min.css">` の 1 行で導入可能（PostCSS 不要）
  - デザイントークン（CSS 変数）はプリビルド版でも後から上書き可能（ブレークポイントのみビルド時に焼き込み）
  - `npm run build` で生成、`prepare` スクリプトにより publish / pack / git インストール時に自動生成
- **`floncss/core/layers.css`** — カスケードレイヤー順序の正準定義（単一の情報源）。テンプレートとプリビルドの両方がこれを参照するため、プリビルド利用時も `@layer components { ... }` に書いたカスタム CSS が正しく trumps より弱い位置に入ります
- **`floncss/postcss-features`** — postcss-preset-env 共通設定の共有モジュール。リポジトリ・プリビルド・`init` が生成するユーザー設定の 3 箇所が同一の設定を参照します
- **`--gap-3xs` トークンを settings テンプレートに追加**（`gap:3xs` / `row-gap:3xs` の参照先）
- **GitHub Actions CI を追加** — 実際のユーザー環境を模したスモークテスト（`npm install` → `floncss init` → PostCSS ビルド → 出力検証）
- **package.json に `repository` / `homepage` / `bugs` / `author` を設定**
- **peerDependencies をすべて optional に**（プリビルド版のみ使う場合は PostCSS ツールチェーンのインストール不要）

### 修正（Fixed）

- `color:red-light` / `bg-color:red-light` / `border-color:red-light` が `--color-red` を参照していたコピペミスを修正（正: `--color-red-light`）
- `.gap:none` / `.row-gap:none` が単位なしの `0` を設定し、`.cols` の `calc()` を無効化していた問題を修正（`0px` に変更）
- grid の gap 実装を `grid/grid.css` に一元化
  - `displays.css` 側の `--grid-gap` 指定は常に上書きされる死にコードでした
  - `.inline-grid` およびレスポンシブ変形（`.grid@md` など）で `gap:*` ユーティリティが効かなかった問題を修正
  - `.grid@md` 等でも `--grid-*` 変数（`grid-cols:N` の参照先）が利用可能に
- postcss-preset-env の `cascade-layers` ポリフィルを全 PostCSS 設定で無効化（`@layer` が詳細度ハックに変換され CSS が肥大化するのを防止）
- CLI: 生成する postcss.config.js のパスを Windows でも壊れないよう `/` 区切りに正規化、`@import` 案内パスの表示を修正（`././floncss` → `./floncss`）
- CLI: 既存の postcss.config.js がある場合、v3 テンプレートに必要な設定（`cascade-layers: false`）の案内を表示
- プリビルドの生成時に空の `@layer` ブロックを除去（約 1KB 削減）

### ドキュメント（Docs）

- README に「設計思想 - なぜ FlonCSS か」セクションを追加
- v2 → v3 移行ガイドを README に追加
- ブレークポイントの記載をテンプレートの実値（640 / 768 / 1024 / 1280px）に統一
- `font:itaric` → `font:italic` の誤記修正、`col-span` / `row-span` の範囲（1〜12 + `full`）修正
- 未記載だった Sizes / Flex Grow / Align Content ユーティリティのドキュメントを追加
- Generic / Base レイヤーの説明を実態（init 時にテンプレートをコピー）に合わせて修正
- `templates/components/README.md` の記述例の誤記（`display; flex;`）を修正

## [2.1.0] 以前

v2.1.0 以前の変更は [GitHub のコミット履歴](https://github.com/dsflon/FlonCSS-core/commits/main) を参照してください。
