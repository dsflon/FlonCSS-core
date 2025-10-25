# Base - 基本要素レイヤー

## 役割

HTML 要素のデフォルトスタイルを定義し、プロジェクト全体の基本的な見た目を統一します。  
**必要最低限の指定は floncss に組み込まれています。**  
必要に応じて記述を追加してください。

## FLONCSS における位置

**詳細度**: 0,0,1（要素セレクタのみ）  
**レイヤー順序**: 3 番目（Generic の次）

## 特徴

- ✅ HTML 要素のスタイルを定義
- ✅ 要素セレクタのみを使用
- ✅ Settings で定義した変数を使用
- ❌ クラスセレクタは使用しない
- ❌ 複雑なレイアウトは含まない

## 記述例

```css
body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--color-text);
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-heading);
}

h1 {
  font-size: var(--font-size-h1);
}
h2 {
  font-size: var(--font-size-h2);
}
h3 {
  font-size: var(--font-size-h3);
}

p {
  margin-bottom: var(--space-md);
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

input,
textarea,
select {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  padding: var(--input-padding);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
}

button {
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
  padding: var(--button-padding);
  border: none;
  background: var(--color-primary);
  color: white;
  border-radius: var(--border-radius);
}

...
```
