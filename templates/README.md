# FlonCSS Templates

このディレクトリには、プロジェクトでカスタマイズ可能な FlonCSS のテンプレートファイルが含まれています。

## ディレクトリ構成（ITCSS 設計）

FlonCSS は **ITCSS（Inverted Triangle CSS）** アーキテクチャに基づいて設計されています。  
各レイヤーは上から下に向かって詳細度が高くなります。

### 📁 settings/ - 設定レイヤー

- **役割**: CSS 変数とデザイントークンの定義
- **内容**: 色、フォント、サイズ、ブレークポイントなど
- **詳細**: [settings/README.md](./settings/README.md)

### 📁 generic/ - 汎用リセットレイヤー

- **役割**: ブラウザのデフォルトスタイルをリセット
- **内容**: 基本的なリセット（reset.css）が init 時にコピーされる。自由に編集・追加可能
- **詳細**: [generic/README.md](./generic/README.md)

### 📁 base/ - 基本要素レイヤー

- **役割**: HTML 要素のデフォルトスタイルを定義
- **内容**: 必要最低限の指定（base.css）が init 時にコピーされる。自由に編集・追加可能
- **詳細**: [base/README.md](./base/README.md)

### 📁 objects/ - オブジェクトレイヤー

- **役割**: 再利用可能な UI パーツとレイアウトパターン
- **内容**: ボタン、ボックス、タイトルなど（ある程度の装飾を含む）
- **詳細**: [objects/README.md](./objects/README.md)

### 📁 components/ - コンポーネントレイヤー

- **役割**: プロジェクト固有の具体的な UI コンポーネント
- **内容**: カード、ナビゲーション、ヘッダー、フッターなど
- **詳細**: [components/README.md](./components/README.md)

### 📄 global.css - エントリーポイント

すべてのレイヤーを統合するメインファイル。レスポンシブユーティリティの選択も可能。

---

## 使い方

### 1. CLI でコピー（推奨）

```bash
// プロジェクト直下に 'floncss' ディレクトリを構成
npx floncss init

// ディレクトリを指定して構成する場合
npx floncss init ./path/to/floncss
```

これにより、以下が作成されます:

- `./path/to/floncss/settings/` - カスタマイズ可能な設定
- `./path/to/floncss/generic/` - 追加リセット用（オプション）
- `./path/to/floncss/base/` - 追加要素スタイル用（オプション）
- `./path/to/floncss/objects/` - オブジェクトパーツ
- `./path/to/floncss/components/` - プロジェクト固有のコンポーネント
- `./path/to/floncss/global.css` - エントリーポイント
- `./postcss.config.js` - PostCSS 設定（プロジェクト直下）

### 2. global.css の構成

`global.css` は ITCSS のレイヤー順序をカスケードレイヤー（`@layer`）で宣言した上で、各レイヤーをインポートします:

```css
@layer settings, generic, base, objects, components, trumps;

@import url("./settings") layer(settings);
@import url("./generic") layer(generic);
@import url("./base") layer(base);
@import url("./objects") layer(objects);
@import url("./components") layer(components);

/* FlonCSSコア（Trumps） */
@import url("floncss/core") layer(trumps);

/* レスポンシブユーティリティ（必要なものを有効化） */
@import url("floncss/trumps/media-sm") layer(trumps);
@import url("floncss/trumps/media-md") layer(trumps);
@import url("floncss/trumps/media-lg") layer(trumps);
@import url("floncss/trumps/media-xl") layer(trumps);
```

`@layer` 宣言の順序（後ろほど強い）が import の記述順に優先するため、ユーティリティが常にコンポーネントに勝つことが保証されます。  
**注意**: レイヤーに属さない CSS はすべてのレイヤーより優先されます。カスタムスタイルは `components` などのレイヤーに入れてください。

### 3. レスポンシブユーティリティのカスタマイズ

不要なブレークポイントはコメントアウトできます:

```css
/* @import url("floncss/trumps/media-sm") layer(trumps); */
@import url("floncss/trumps/media-md") layer(trumps);
@import url("floncss/trumps/media-lg") layer(trumps);
/* @import url("floncss/trumps/media-xl") layer(trumps); */
```

### 4. PostCSS 設定

`postcss.config.js` は自動的にプロジェクト直下に配置されます。  
既存の設定がある場合はスキップされるので、必要に応じて手動で統合してください。

---

## カスタマイズの流れ

1. **Settings** - デザイントークン（色、サイズなど）をカスタマイズ
2. **Objects** - 再利用可能な UI パーツを追加・編集
3. **Components** - プロジェクト固有のコンポーネントを作成
4. **global.css** - 必要なレスポンシブユーティリティを選択

---

## FlonCSS の利点

- ✅ **明確な構造**: 各レイヤーの役割が明確
- ✅ **詳細度の管理**: 上から下に向かって詳細度が増加
- ✅ **保守性の向上**: どこに何を書くべきか明確
- ✅ **競合の回避**: 詳細度の衝突を最小化

---

## 詳細情報

各レイヤーの詳細な使い方は、各ディレクトリ内の README.md を参照してください:

- [settings/README.md](./settings/README.md)
- [generic/README.md](./generic/README.md)
- [base/README.md](./base/README.md)
- [objects/README.md](./objects/README.md)
- [components/README.md](./components/README.md)
