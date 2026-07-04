# FlonCSS v3.0.0 引き継ぎドキュメント

このドキュメントは、v3.0.0 の変更内容・設計判断の理由・既知の制約・今後の課題を、開発を引き継ぐ人向けにまとめたものです。ユーザー向けの変更一覧は [CHANGELOG.md](../CHANGELOG.md) を参照してください。

## リポジトリ構成

```
FlonCSS-core/
├── core/                  # npm 配布されるフレームワーク本体
│   ├── generic/           # プレースホルダー（実体はテンプレート側）
│   ├── base/              # プレースホルダー（実体はテンプレート側）
│   ├── trumps/            # ユーティリティクラス（フレームワークの本体）
│   │   ├── */             # カテゴリごとに @define-mixin + $(screen) で定義
│   │   └── media-*.css    # ブレークポイントごとに mixin を @media 内で展開
│   └── index.css
├── templates/             # `npx floncss init` でユーザープロジェクトにコピーされる雛形
│   ├── settings/          # デザイントークン（CSS 変数）と @custom-media
│   ├── generic/ base/     # リセット・基本要素スタイル（コピー後は自由に編集）
│   ├── objects/ components/
│   └── global.css         # エントリーポイント（@layer 宣言を含む）
├── scripts/
│   ├── build-dist.js      # プリビルド CSS の生成
│   └── dist-entry.css     # プリビルドのエントリー（テンプレートのデフォルトを焼き込む）
├── cli.js                 # `floncss init`（テンプレートコピー + postcss.config.js 生成）
└── .github/workflows/ci.yml
```

### ユーティリティ生成の仕組み

各カテゴリ（gutters, displays など）は `@define-mixin <name> $screen { ... }` で定義され、
`$(screen)` がクラス名接尾辞（`\@md` など）に展開されます。

- ベースクラス: 各ファイル末尾の `@mixin <name>;`（接尾辞なし）
- レスポンシブ: `media-<bp>.css` → `<category>-<bp>.css` → `@media (--media-<bp>) { @mixin <name> \@<bp>; }`
- `@custom-media --media-*` の実値はユーザーの `settings/custom-media.css` が持つ（＝ブレークポイントはユーザー定義）

## v3.0.0 の主要な設計判断と理由

### 1. カスケードレイヤー（@layer）の採用

- **どこで**: `templates/global.css` と `scripts/dist-entry.css` のみ。**コア（core/）はレイヤー非依存のまま**
- **なぜ**: ITCSS の「trumps が常に勝つ」規律を import 順序でなく言語仕様で担保するため。コアをレイヤー非依存に保つことで、`floncss/core` を直接使う既存ユーザーを壊さず、利用側がレイヤー戦略を選べる
- **重要な注意点**: レイヤーに属さない CSS は常に全レイヤーに勝つ（CSS の仕様）。ユーザーのカスタム CSS がユーティリティを上書きしてしまう事故はここから起きるため、ドキュメントで「カスタム CSS はレイヤーに入れる」ことを繰り返し案内している

### 2. PostCSS 設定の単一情報源: `postcss-features.js`

- postcss-preset-env の設定（`custom-properties: false` / `custom-media-queries` 展開 / `nesting-rules: false` / `cascade-layers: false`）は **`postcss-features.js` に一元化**されている
- 参照箇所: `postcss.config.js`（リポジトリ用）、`scripts/build-dist.js`（プリビルド用）、`init` が生成するユーザー設定（`require('floncss/postcss-features')`）。npm の `exports` に `./postcss-features` を公開している
- 特に **`cascade-layers: false` は必須**。これを忘れると preset-env のポリフィルが `@layer` を詳細度ハック（`:not(#\#)` の連鎖）に変換し、出力が約 2 倍に肥大化し、ネイティブレイヤーの意味も失われる（CI が `:not(#` の不在を検証している）
- 注意: v2 で生成された古い postcss.config.js を持つプロジェクトが v3 テンプレートを使うとこの問題が起きる。cli.js は既存 config を検出した際に案内を表示する

### 2.5. レイヤー順序の単一情報源: `core/layers.css`

- `@layer settings, generic, base, objects, components, trumps;` の正準定義。テンプレートの `global.css` とプリビルドの `scripts/dist-entry.css` の両方が最初にインポートする
- プリビルドでは objects / components レイヤーは空だが、**必ず全レイヤーを宣言する**こと。宣言しないと、利用者が `@layer components { ... }` と書いた時点でそのレイヤーが trumps の後ろに追加され、「ユーティリティが常に勝つ」保証が反転する（レビューで実際に検出されたバグ）
- テンプレートからの参照は `floncss/core/layers.css` という**実パス**を使う。`floncss/layers` という exports エイリアスも公開しているが、postcss-import-resolver（enhanced-resolve 4.x）は `exports` マップを解決できないため、テンプレート内では使えない

### 3. flex / grid / cols の gap セマンティクス統一と `:where()` パターン

- 全コンテナ共通: デフォルト `--column-gap: 0px`、消費側は `column-gap: var(--column-gap)`、`row-gap: var(--row-gap, var(--column-gap))`
- `gap:*` / `row-gap:*` ユーティリティはプロパティを直接書かず **変数をセットするだけ**。コンテナ側が消費する
- **コンテナのデフォルト変数は必ず `:where()`（詳細度 0）で宣言する**こと。通常の詳細度（0,1,0）で宣言すると、media ファイル内のコンテナ変形（`.flex@md` 等）がソース順で後になり、ベースの `gap:*` クラスを上書きしてしまう（`flex@md gap:lg` が gap 0 になるバグとしてレビューで検出・修正済み）。`:where()` ならソース順・ブレークポイントの組み合わせに関係なくユーティリティが勝ち、かつ親からの変数継承も遮断できる
- `0px` と単位付きなのは意図的（`.cols` の `calc((100% + var(--column-gap)) / 12)` 内で単位なし `0` は無効になるため）。**`--column-gap` / `--row-gap` に単位なしの 0 を入れてはいけない**
- grid コンテナの `--grid-*` 変数と gap 配線は `@define-mixin grid $screen` の中にあり、各 `media-*.css` の `@mixin grid \@bp` 呼び出しから自動生成される。**ブレークポイントを追加しても手動同期は不要**

### 4. プリビルド CSS（dist/）

- `dist/` は **git にコミットされない**（.gitignore 済み）。`npm run build` で生成、`prepare` スクリプトにより **publish / `npm pack` / git インストール（`npm i dsflon/FlonCSS-core`）のすべてで自動生成**される（`prepublishOnly` だと git インストールで dist が欠落するため `prepare` を使用。`scripts/` も files に含めてある）
- エントリーは `scripts/dist-entry.css`。テンプレートのデフォルトトークン + リセット + 基本要素 + 全ブレークポイントのユーティリティを含む
- **デザイントークンは実行時に上書き可能**（`custom-properties: false` で `var()` を保持しているため）。実ブラウザ（Chromium）で computed style を検証済み
- **ブレークポイントのみ変更不可**（`@custom-media` はビルド時に実メディアクエリへ展開される。メディアクエリは `var()` を参照できないため原理的な制約）

### 5. その他

- peerDependencies は全て `peerDependenciesMeta.optional: true`。プリビルドだけ使う人に PostCSS 一式を強制しないため
- Google Fonts の `@import` はテンプレートでコメントアウト（レンダリングブロック・GDPR 配慮）。`--font-family-primary` は游ゴシック等のローカルフォントにフォールバックする
- `.cols` は非推奨（コード上の `@deprecated` コメント + README 記載）。削除は次のメジャーで

## 検証方法

CI（`.github/workflows/ci.yml`）が以下を自動実行します。ローカルでも同じ手順で再現できます:

1. **プリビルド**: `npm ci && npm run build` → dist が生成され、ネイティブ `@layer` が維持されている（`:not(#` が含まれない）こと
2. **ユーザー環境の再現**: 空ディレクトリで `npm install <このリポジトリ> + PostCSS 一式` → `npx floncss init` → media-md を有効化 → `npx postcss floncss/global.css -o dist/global.css`
3. **出力検証**: ベースユーティリティ・レスポンシブバリアント・メディアクエリ展開・`@layer` 宣言・mixin 未解決なし

トークン上書きの動作確認は Playwright + Chromium で computed style を見るのが確実です（margin-top / color / column-gap / レスポンシブ font-size で確認済み）。

## 既知の制約・今後の課題（ロードマップ候補）

優先度順:

1. **クラス名プレフィックスオプション** — `.flex` `.grid` `.hidden` など汎用名はサードパーティ CSS と衝突しやすい。PostCSS プラグインまたはビルドオプションでの任意プレフィックス付与を検討
2. **ダークモード / セマンティックカラートークン** — 現状は raw スケール（`--color-900` 等）のみ。`--color-text` / `--color-surface` などの意味論トークン層と `color-scheme` 対応を足すとテーマ切り替えが自然になる
3. **dist のバリエーション** — 現在は全ブレークポイント入りの 1 種のみ（min 約 137KB、gzip 約 16KB）。内訳はレスポンシブ 4 セットが約 77% を占める。ブレークポイント別（`floncss-core` + `floncss-md` など）や、非推奨の `.cols` を除いた軽量版の提供を検討
4. **`.cols` の削除**（次のメジャー。削除時は dist のサイズ・内容が変わる点に注意）
5. **`--gutter-base`（32px）がスケール内で md（48px）と sm（16px）の間にあり直感的でない** — 値を変えると破壊的変更になるため、変更するならメジャーで
6. **CI の出力検証が cssnano の直列化に軽く依存** — 現在は宣言単位の部分一致に緩和済みだが、本質的には postcss でパースして構造的にアサートする verify スクリプト（`npm test`）化が望ましい
7. **プリビルドの残存する空 `@layer` ブロック 2 個（約 40 バイト）** — cssnano がコメント除去した後に空になるルール由来。実害なし

## リリース手順

1. CHANGELOG.md を更新し、`package.json` の version を上げる（`npm version` 推奨）
2. `npm run build` で dist を生成し、目視 + CI で確認
3. `npm publish`（`prepare` が build を再実行するため dist の入れ忘れは起きない）
4. GitHub で該当バージョンのタグ / リリースを作成し、CHANGELOG の該当セクションを転記
5. README の unpkg URL はメジャーで固定してある（`floncss@3`）。次のメジャーでは更新すること
