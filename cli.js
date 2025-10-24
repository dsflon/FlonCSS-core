#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const command = process.argv[2];

if (command === 'init') {
  const targetDir = process.argv[3] || './floncss-custom';
  const templatesDir = path.join(__dirname, 'templates');
  
  console.log('🎨 FLONCSS を初期化しています...');
  
  try {
    // テンプレートディレクトリをコピー
    copyDirectory(templatesDir, targetDir);
    
    console.log('✅ 初期化完了!');
    console.log('');
    console.log(`カスタマイズ可能なファイルが ${targetDir} に作成されました。`);
    console.log('');
    console.log('次のステップ:');
    console.log(`1. ${targetDir}/settings/ でデザイントークンをカスタマイズ`);
    console.log(`2. ${targetDir}/objects/ でオブジェクトスタイルをカスタマイズ`);
    console.log('');
    console.log('CSSファイルで以下のようにインポートしてください:');
    console.log('');
    console.log("  @import 'floncss/dist/core.css';");
    console.log(`  @import './${targetDir}/custom.css';`);
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
  console.log('  npx floncss init              - ./floncss-custom に初期化');
  console.log('  npx floncss init ./styles     - ./styles に初期化');
}

function copyDirectory(src, dest) {
  // ディレクトリが存在しない場合は作成
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
