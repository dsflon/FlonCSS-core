#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const command = process.argv[2];

if (command === 'init') {
  const targetDir = process.argv[3] || './floncss';
  const templatesDir = path.join(__dirname, 'templates');
  
  console.log('🎨 FLONCSS を初期化しています...');
  
  try {
    // postcss.config.js を動的に生成してプロジェクト直下に配置
    const postcssConfigDest = path.join(process.cwd(), 'postcss.config.js');
    
    // postcss.config.js が既に存在する場合は警告
    let postcssConfigCopied = false;
    if (fs.existsSync(postcssConfigDest)) {
      console.log('⚠️  postcss.config.js は既に存在するため、スキップしました。');
      console.log('   必要に応じて手動で設定を統合してください。');
    } else {
      // targetDir からの相対パスを計算
      const relativePath = path.relative(process.cwd(), path.resolve(targetDir));
      
      // postcss.config.js の内容を生成
      const postcssConfig = generatePostCSSConfig(relativePath);
      fs.writeFileSync(postcssConfigDest, postcssConfig, 'utf-8');
      postcssConfigCopied = true;
    }
    
    // postcss.config.js 以外のテンプレートをコピー
    copyDirectory(templatesDir, targetDir, ['postcss.config.js']);
    
    console.log('✅ 初期化完了!');
    console.log('');
    console.log(`📁 作成されたファイル:`);
    console.log(`  ${targetDir}/`);
    console.log(`  ├── settings/          # デザイントークン`);
    console.log(`  ├── objects/           # 再利用可能なコンポーネント`);
    console.log(`  └── global.css         # エントリーポイント`);
    if (postcssConfigCopied) {
      console.log(`  `);
      console.log(`  ./postcss.config.js    # PostCSS 設定 (プロジェクト直下)`);
    }
    console.log('');
    console.log('次のステップ:');
    console.log(`1. ${targetDir}/settings/custom-media.css でブレークポイントをカスタマイズ`);
    console.log(`2. ${targetDir}/settings/ でデザイントークンをカスタマイズ`);
    console.log(`3. ${targetDir}/objects/ でオブジェクトスタイルをカスタマイズ`);
    console.log('');
    console.log('📝 使い方 (シンプル):');
    console.log('');
    console.log(`  @import './${targetDir}/global.css';`);
    console.log('');
    console.log('💡 global.css に FLONCSS コアと全ての設定が含まれています。');
    if (postcssConfigCopied) {
      console.log('💡 postcss.config.js がプロジェクト直下に作成されました。');
    }
    console.log('');
  } catch (err) {
    console.error('❌ エラーが発生しました:', err.message);
    process.exit(1);
  }
} else {
  console.log('FLONCSS CLI');
  console.log('');
  console.log('使い方:');
  console.log('  npx floncss init [directory]  - カスタマイズ可能なテンプレートを初期化');
  console.log('');
  console.log('例:');
  console.log('  npx floncss init              - ./floncss に初期化');
  console.log('  npx floncss init ./styles     - ./styles に初期化');
}

function generatePostCSSConfig(stylesPath) {
  return `/**
 * PostCSS Configuration for FLONCSS
 * 
 * このファイルは FLONCSS を使用するための PostCSS 設定です。
 * 
 * 必要なプラグイン:
 * - postcss-import: @import を解決
 * - postcss-mixins: CSS mixins を使用可能に
 * - postcss-preset-env: 最新の CSS 機能を使用可能に
 */

const path = require('path');

module.exports = {
  plugins: {
    'postcss-import': {
      resolve: (id, basedir, importOptions) => {
        // floncss/ で始まるインポートを node_modules/floncss/ に解決
        if (id.startsWith('floncss/')) {
          const floncssPath = path.resolve(__dirname, 'node_modules', id);
          return floncssPath;
        }
        // その他は通常通り解決
        return id;
      }
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
        'nesting-rules': true,
      },
      preserve: false,
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
