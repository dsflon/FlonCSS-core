# Objects - オブジェクトレイヤー

## 役割

レイアウト目的パーツやこれ以上細分化できない UI パーツなどをコンポーネントとして定義します。
Objects レイヤーのコンポーネントは自己完結的であり、外部のレイアウトに影響を与えないようにします。

## ITCSS における位置

**詳細度**: 0,1,0（クラスセレクタ）  
**レイヤー順序**: 4 番目（Base の次）

## 特徴

- ✅ レイアウト目的パーツやこれ以上細分化できない UI パーツを定義
- ✅ 再利用可能なコンポーネントパターン
- ✅ 構造的なスタイルに加え、ある程度の装飾も許容（ボタン、タイトルなど）
- ✅ プロジェクト横断的に使える汎用性の高いパーツ
- ❌ **外部レイアウトに影響を及ぼすスタイルは原則禁止**（`margin`, `position: absolute/fixed` など）
- ⚠️ ページ固有のデザインや用途が限定的なデザインは Components レイヤーで定義

## 命名規則（オプション）

`.o-` プレフィックスを使用してオブジェクトであることを明示できます：

- `.o-button` - ボタンコンポーネント
- `.o-box` - 汎用ボックスコンポーネント
- `.o-title` - タイトルコンポーネント
- etc.

## ファイル構成

- **button.css** - ボタン
- **box.css** - 汎用ボックス
- **title.css** - タイトル
- etc.

## 記述例

```css
/* objects/button.css */

[class*="o-button:"] {
  border-radius: var(--radius-base);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.o-button\:primary {
  color: var(--color-000);
  background-color: var(--color-primary);

  @media (hover: hover) {
    color: var(--color-primary);
    background-color: var(--color-000);
  }
}

.o-button\:secondary {
  color: var(--color-000);
  background-color: var(--color-secondary);

  @media (hover: hover) {
    color: var(--color-secondary);
    background-color: var(--color-000);
  }
}
```
