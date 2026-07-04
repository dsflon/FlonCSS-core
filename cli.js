#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const command = process.argv[2];

if (command === 'init') {
  const targetDir = process.argv[3] || './floncss';
  const templatesDir = path.join(__dirname, 'templates');
  // 正規化した相対パス（'./floncss' → 'floncss'）。
  // 生成する設定ファイルや @import 案内に埋め込むため、Windows でも '/' 区切りに統一する
  const displayPath = (path.relative(process.cwd(), path.resolve(targetDir)) || '.')
    .split(path.sep)
    .join('/');
  const globalCssPath = displayPath === '.' ? './global.css' : `./${displayPath}/global.css`;
  
  console.log('🎨 FlonCSS を初期化しています...');
  
  try {
    // postcss.config.js を動的に生成してプロジェクト直下に配置
    const postcssConfigDest = path.join(process.cwd(), 'postcss.config.js');
    
    // postcss.config.js が既に存在する場合は警告
    let postcssConfigCopied = false;
    if (fs.existsSync(postcssConfigDest)) {
      console.log('⚠️  postcss.config.js は既に存在するため、スキップしました。');
      console.log('   必要に応じて手動で設定を統合してください。');
      console.log('');
      console.log('   ❗ v3 のテンプレートは @layer（カスケードレイヤー）を使用します。');
      console.log('      既存の設定の postcss-preset-env に以下が含まれているか確認してください:');
      console.log('');
      console.log("      'postcss-preset-env': require('floncss/postcss-features'),");
      console.log('');
      console.log('      （個別設定する場合は features に \'cascade-layers\': false が必須です。');
      console.log('       これがないと @layer が詳細度ハックに変換され、レイヤーが機能しません）');
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
    console.log('1. PostCSS ツールチェーンをインストール（未導入の場合）:');
    console.log('   npm install -D postcss postcss-cli postcss-import postcss-mixins postcss-preset-env postcss-import-resolver cssnano');
    console.log(`2. ${displayPath}/settings/ でデザイントークンをカスタマイズ`);
    console.log(`3. ${displayPath}/objects/ で再利用可能なUIパーツを作成`);
    console.log(`4. ${displayPath}/components/ でプロジェクト固有のコンポーネントを作成`);
    console.log(`5. ${displayPath}/global.css で必要なレスポンシブユーティリティを選択`);
    console.log('');
    console.log('📝 使い方:');
    console.log('');
    console.log(`  @import '${globalCssPath}';`);
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

function generatePostCSSConfig(srcDir) {
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
    /**
     * preset-env の設定は FlonCSS が提供する共通設定を使用します。
     * （custom-properties / nesting-rules / cascade-layers を変換しない等。
     *   個別に設定する場合も 'cascade-layers': false は必須です）
     */
    'postcss-preset-env': require('floncss/postcss-features'),
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
