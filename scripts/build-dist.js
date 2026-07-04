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

const plugins = [
  atImport(),
  mixins(),
  presetEnv({
    features: {
      'custom-properties': false,
      'custom-media-queries': { preserve: false },
      'nesting-rules': false,
      // @layer はネイティブサポートされているため、ポリフィル（詳細度ハックへの変換）を無効化
      'cascade-layers': false,
    },
    preserve: false,
  }),
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
