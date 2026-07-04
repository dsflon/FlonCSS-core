#!/usr/bin/env node

/**
 * プリビルド CSS を生成するスクリプト
 *
 * dist/floncss.css     - テンプレートのデフォルト設定 + 全ユーティリティ（未圧縮）
 * dist/floncss.min.css - 上記の圧縮版（<link> でそのまま利用可能）
 */

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const atImport = require('postcss-import');
const mixins = require('postcss-mixins');
const presetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');

const root = path.join(__dirname, '..');
const entry = path.join(__dirname, 'dist-entry.css');
const outDir = path.join(root, 'dist');

/**
 * インポート単位で生成される空の @layer ブロック（コメントのみのファイル等）を除去する。
 * レイヤー順序は core/layers.css の @layer 文で確定しているため、削除しても安全。
 * `@layer a, b;` 形式の順序宣言文（nodes を持たない）は対象外。
 */
const stripEmptyLayers = {
  postcssPlugin: 'strip-empty-layers',
  OnceExit(root) {
    root.walkAtRules('layer', (atRule) => {
      if (atRule.nodes && atRule.nodes.every((n) => n.type === 'comment')) {
        atRule.remove();
      }
    });
  },
};

const plugins = [
  atImport(),
  mixins(),
  // preset-env の設定は postcss-features.js で一元管理
  presetEnv(require('../postcss-features')),
  stripEmptyLayers,
];

async function build() {
  fs.mkdirSync(outDir, { recursive: true });
  const source = fs.readFileSync(entry, 'utf8');

  const expanded = await postcss(plugins).process(source, {
    from: entry,
    map: false,
  });
  const cssPath = path.join(outDir, 'floncss.css');
  fs.writeFileSync(cssPath, expanded.css);

  const minified = await postcss([
    cssnano({
      preset: ['default', { discardComments: { removeAll: true } }],
    }),
  ]).process(expanded.css, { from: undefined, map: false });
  const minPath = path.join(outDir, 'floncss.min.css');
  fs.writeFileSync(minPath, minified.css);

  const kb = (p) => (fs.statSync(p).size / 1024).toFixed(1);
  console.log(`✅ dist/floncss.css     (${kb(cssPath)} KB)`);
  console.log(`✅ dist/floncss.min.css (${kb(minPath)} KB)`);
}

build().catch((err) => {
  console.error('❌ ビルドに失敗しました:', err);
  process.exit(1);
});
