#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const command = process.argv[2];

if (command === 'init') {
  const targetDir = process.argv[3] || './floncss';
  const templatesDir = path.join(__dirname, 'templates');
  // 表示用に正規化した相対パス（'./floncss' → 'floncss'）
  const displayPath = path.relative(process.cwd(), path.resolve(targetDir)) || '.';
  
  console.log('🎨 FlonCSS を初期化しています...');
  
  try {
    // postcss.config.js を動的に生成してプロジェクト直下に配置
    const postcssConfigDest = path.join(process.cwd(), 'postcss.config.js');
    
    // postcss.config.js が既に存在する場合は警告
    let postcssConfigCopied = false;
    if (fs.existsSync(postcssConfigDest)) {
      console.log('⚠️  postcss.config.js は既に存在するため、スキップしました。');
      console.log('   必要に応じて手動で設定を統合してください。');
    } else {
      // postcss.config.js の内容を生成
      const postcssConfig = generatePostCSSConfig(displayPath);
      fs.writeFileSync(postcssConfigDest, postcssConfig, 'utf-8');
      postcssConfigCopied = true;
    }
    
    // postcss.config.js 以外のテンプレートをコピー
    copyDirectory(templatesDir, targetDir, ['postcss.config.js']);
    
    console.log('✅ 初期化完了!');
    console.log('');
    console.log(`📁 作成されたファイル:`);
    console.log(`  ${targetDir}/`);
    console.log(`  ├── settings/          # デザイントークン（色、フォント、ブレークポイント）`);
    console.log(`  ├── generic/           # リセットCSS（任意で変更してください）`);
    console.log(`  ├── base/              # 基本要素スタイル（任意で変更してください）`);
    console.log(`  ├── objects/           # 再利用可能なUIパーツ（任意で変更してください）`);
    console.log(`  ├── components/        # プロジェクト固有のコンポーネント`);
    console.log(`  └── global.css         # エントリーポイント`);
    if (postcssConfigCopied) {
      console.log(`  `);
      console.log(`  ./postcss.config.js    # PostCSS 設定（プロジェクト直下）`);
    }
    console.log('');
    console.log('次のステップ:');
    console.log(`1. ${targetDir}/settings/ でデザイントークンをカスタマイズ`);
    console.log(`2. ${targetDir}/objects/ で再利用可能なUIパーツを作成`);
    console.log(`3. ${targetDir}/components/ でプロジェクト固有のコンポーネントを作成`);
    console.log(`4. ${targetDir}/global.css で必要なレスポンシブユーティリティを選択`);
    console.log('');
    console.log('📝 使い方:');
    console.log('');
    console.log(`  @import './${displayPath}/global.css';`);
    console.log('');
    console.log('💡 global.css には FlonCSS コア（Generic, Base, Trumps）が含まれています。');
    console.log('💡 詳細は各ディレクトリの README.md を参照してください。');
    if (postcssConfigCopied) {
      console.log('💡 postcss.config.js がプロジェクト直下に作成されました。');
    }
    console.log('');
  } catch (err) {
    console.error('❌ エラーが発生しました:', err.message);
    process.exit(1);
  }
} else {
  console.log('FlonCSS CLI');
  console.log('');
  console.log('使い方:');
  console.log('  npx floncss init [directory]  - カスタマイズ可能なテンプレートを初期化');
  console.log('');
  console.log('例:');
  console.log('  npx floncss init              - ./floncss に初期化');
  console.log('  npx floncss init ./path/to/floncss     - ./path/to/floncss に初期化');
}

function generatePostCSSConfig(stylesPath) {
  const srcDir = stylesPath || 'floncss';

  return `/**
 * PostCSS Configuration for FlonCSS
 * 
 * このファイルは FlonCSS を使用するための PostCSS 設定です。
 * 
 * 必要なプラグイン:
 * - postcss-import: @import を解決
 * - postcss-mixins: CSS mixins を使用可能に
 * - postcss-preset-env: 最新の CSS 機能を使用可能に
 */

const path = require('path');
const resolver = require('postcss-import-resolver');

module.exports = {
  plugins: {
    'postcss-import': {
      resolve: resolver({
        alias: {
          '@floncss': path.join(__dirname, '${srcDir}'),
          'floncss/trumps': path.join(__dirname, 'node_modules/floncss/core/trumps'),
        },
      }),
    },
    'postcss-mixins': {},
    'postcss-preset-env': {
      features: {
        // custom-media-queries は展開（必要なら）
        'custom-media-queries': {
          preserve: false,
        },
        // カスタムプロパティの変換を無効化することで、フォールバック値の生成を防ぐ
        'custom-properties': false,
        'nesting-rules': false,
        // @layer はネイティブサポートされているため、ポリフィル（詳細度ハックへの変換）を無効化
        'cascade-layers': false,
      },
      preserve: false,
    },
    'cssnano': {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
      }],
    },
  }
}
`;
}

function copyDirectory(src, dest, excludeFiles = []) {
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    // 除外ファイルをスキップ
    if (excludeFiles.includes(entry.name)) {
      continue;
    }
    
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, excludeFiles);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
