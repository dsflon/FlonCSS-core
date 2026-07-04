/**
 * postcss-preset-env の共通設定（単一の情報源）
 *
 * 使用箇所:
 * - postcss.config.js（このリポジトリの開発用）
 * - scripts/build-dist.js（プリビルド CSS の生成）
 * - `npx floncss init` が生成するユーザープロジェクトの postcss.config.js
 *   （`require('floncss/postcss-features')` として参照）
 *
 * 設定の意図:
 * - custom-properties: false
 *     CSS 変数を実行時に上書き可能なまま保持する（フォールバック値の焼き込みを防ぐ）
 * - custom-media-queries: preserve: false
 *     @custom-media を実メディアクエリに展開する
 * - nesting-rules: false
 *     CSS ネスティングはネイティブサポートされているため変換しない
 * - cascade-layers: false
 *     @layer はネイティブサポートされているため、ポリフィル
 *     （詳細度ハックへの変換）を無効化する。これを忘れると @layer が
 *     :not(#\#) の連鎖に変換され、出力が肥大化しレイヤーの意味も失われる
 */
module.exports = {
  features: {
    'custom-properties': false,
    'custom-media-queries': {
      preserve: false,
    },
    'nesting-rules': false,
    'cascade-layers': false,
  },
  preserve: false,
};
