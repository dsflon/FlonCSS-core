# CLAUDE.md

FlonCSS — ITCSS ベースの CSS 設計と最小限の utility-first を組み合わせたハイブリッド CSS フレームワーク。
npm パッケージとして配布され、`npx floncss init` でテンプレートをユーザープロジェクトにコピーする方式。

詳細な設計判断の理由・ロードマップは [docs/HANDOVER.md](./docs/HANDOVER.md)、変更履歴は [CHANGELOG.md](./CHANGELOG.md) を参照。

## リポジトリ構成

```
core/trumps/       ユーティリティクラス本体（@define-mixin + $(screen) で生成）
core/trumps/media-*.css  ブレークポイントごとに mixin を @media 内で展開
core/layers.css    カスケードレイヤー順序の正準定義（単一の情報源）
templates/         `floncss init` でユーザープロジェクトにコピーされる雛形
postcss-features.js  postcss-preset-env 共通設定（単一の情報源）
scripts/build-dist.js  プリビルド CSS（dist/）の生成
cli.js             `floncss init` コマンド
```

## 絶対に守る制約（壊れ方が静かなもの）

1. **`--column-gap` / `--row-gap` に単位なしの `0` を入れない。必ず `0px`。**
   `.cols` の `calc((100% + var(--column-gap)) / 12)` 内で単位なし `0` は無効になり、カラム幅が静かに消える。

2. **コンテナ（flex / grid / cols）のデフォルト変数は `:where()`（詳細度 0）で宣言する。**
   通常の詳細度で宣言すると、media ファイル内のコンテナ変形（`.flex@md` 等）がソース順で後になり、
   ベースの `gap:*` ユーティリティを上書きするバグ（`flex@md gap:lg` が gap 0 になる）が再発する。

3. **PostCSS の preset-env 設定は `postcss-features.js` だけを編集する。**
   `postcss.config.js` / `scripts/build-dist.js` / cli.js が生成するユーザー設定の 3 箇所が参照している。
   個別にインライン設定を書くと、dist・リポジトリ・ユーザープロジェクトの CSS セマンティクスが乖離する。

4. **`cascade-layers: false` を外さない。**
   外すと preset-env のポリフィルが `@layer` を `:not(#\#)` の詳細度ハックに変換し、
   出力が約 2 倍に肥大化しネイティブレイヤーの意味も失われる。CI が `:not(#` の不在を検証している。

5. **レイヤー順序は `core/layers.css` だけで定義する。必ず全レイヤー（objects / components 含む）を宣言する。**
   宣言から漏れたレイヤーは利用者が使った時点で trumps の後ろに追加され、
   「ユーティリティが常に勝つ」保証が反転する。

6. **`core/` はレイヤー非依存を保つ。** `@layer` を使うのはテンプレート（`templates/global.css`）と
   プリビルド（`scripts/dist-entry.css`）のみ。`floncss/core` を直接使う既存ユーザーを壊さないため。

7. **`custom-properties: false` を維持する（トークンの実行時上書き可能性）。**
   プリビルド CSS でも利用者が `:root { --color-primary: ... }` で上書きできることが公開仕様。
   var() を値に焼き込む変換を入れてはいけない。

8. **テンプレート内の import は実パスで書く**（例: `floncss/core/layers.css`）。
   ユーザーのビルドチェーン（postcss-import-resolver = enhanced-resolve 4.x）は
   package.json の `exports` マップを解決できない。exports のエイリアスはテンプレートでは使えない。

9. **`dist/` は git 管理外。`prepare` スクリプトで生成される**（publish / pack / git インストールすべてをカバー）。
   `prepublishOnly` に戻すと git インストールで dist が欠落する。

10. **ユーティリティの追加・変更は必ず mixin（`@define-mixin xxx $screen`）の中に書く。**
    mixin の外に書くとレスポンシブ変形（`@md` 等）が生成されない。
    ブレークポイント変形は各 `media-*.css` の `@mixin xxx \@bp` 呼び出しから自動生成される。

## 変更ポリシー

- ユーティリティのクラス名・デフォルト値の変更、クラス削除は**破壊的変更**。メジャーバージョン +
  CHANGELOG に移行方法を必ず併記する。既存の挙動が変でも、依存しているユーザーがいる前提で扱う。
- `floncss/trumps/*` 配下の個別ファイル単体 import は動作保証外（v3 で明文化済み）。
  サポートするエントリーポイントは `floncss/core` / `floncss/trumps` / `floncss/trumps/media-*`。
- `.cols`（Flex ベース 12 カラム）は非推奨。機能追加はせず、CSS Grid ユーティリティ側に実装する。

## ビルドと検証

```bash
npm run build            # dist/floncss.css / dist/floncss.min.css を生成
```

変更後の検証は CI（.github/workflows/ci.yml）と同じ手順をローカルで再現する:

1. 使い捨てディレクトリで `npm init -y` → `npm install <このリポジトリのパス> + peer 依存一式`
2. `npx floncss init` → global.css の media-md を有効化 → `npx postcss floncss/global.css -o dist/global.css`
3. **出力 CSS を検査する**（ソースではなく）: 対象ユーティリティの存在、`@layer` 宣言、
   `:not(#` の不在、未解決の `@mixin` / `$(screen)` / `--media-*` の不在
4. 挙動に関わる変更（gap・レイヤー優先度・トークン上書き等）は Playwright + Chromium
   （`/opt/pw-browsers` 等の環境のブラウザ）で computed style を観測して確認する

ドキュメント（README / CHANGELOG）に書いた仕様・クラス名・数値は、すべて実装との一致を確認すること。
