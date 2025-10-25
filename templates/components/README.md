# Components - コンポーネントレイヤー

## 役割

装飾のスタイルを持つ UI パーツをコンポーネントとして定義します。Objects レイヤーよりも明示的なクラス名をつけます。  
header や footer など抽象度が低いコンポーネントが該当します。

## ITCSS における位置

**詳細度**: 0,1,0 〜 0,2,0（クラスセレクタ）  
**レイヤー順序**: 5 番目（Objects の次）

## 特徴

- ✅ 具体的な UI コンポーネント
- ✅ 構造 + 装飾スタイル
- ✅ プロジェクト固有のデザイン
- ✅ 色、背景、シャドウなどの見た目
- ❌ 過度に詳細度を高めない

## 命名規則（オプション）

`.c-` プレフィックスを使用してコンポーネントであることを明示できます：

- `.c-header` - ヘッダーコンポーネント
- `.c-footer` - フッターコンポーネント
- `.c-navigation` - ナビゲーションコンポーネント
- etc.

## ファイル構成

プロジェクトの UI に応じて自由に作成できます：

- **navigation.css** - ナビゲーション
- **header.css** - ヘッダー
- **footer.css** - フッター
- etc.

## 記述例

```css
/* components/header.css */

.c-header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: var(--color-000);
  height: var(--height-header);
}

.c-header_inner {
  display; flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-base);
}

...
```

```css
/* components/navigation.css */

.c-navigation {
  display: flex;
  position: fixed;
  top: var(--height-header);
  left: 0;
  width: 128px;
  height: 100%;
  background-color: var(--color-100);
}

...
```
