# 大衆焼肉 美味 — Webサイト

大衆焼肉店「美味」のブランドサイト（トップ1ページ + メニュー一覧）。
Next.js (App Router, static export) / TypeScript / Tailwind CSS v4。`rely/` と同じ構成です。

## 開発

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # out/ に静的サイトを出力
npm run lint
npm test           # データ・画像パス・予約リンクのテスト
npm run typecheck  # build 後に実行（Next.js が型を生成するため）
```

## 編集する場所

| 変更したいもの | ファイル |
| --- | --- |
| 店名・キャッチコピー・予算表示 | `src/config/site.ts` |
| 予約の電話番号・WEB予約URL | `src/config/reservation.ts` |
| 店舗情報（住所・営業時間など） | `src/data/shop.ts` |
| メニュー（料理名・価格・説明・写真・おすすめ） | `src/data/menu.ts` |
| ABOUT / RECOMMEND / PRICE / GALLERY / SCENE の文言・写真 | `src/data/content.ts` |
| ナビゲーション | `src/data/navigation.ts` |
| Instagram のURL | `src/config/site.ts` の `sns.instagram` |
| お客様の声（VOICE。空なら非表示） | `src/data/content.ts` の `voices` |

### 「仮」「サンプル」「イメージ」表記を外す

実データに置き換えたら、次のフラグを `false` にしてください。サイト上の注記がまとめて消えます。

- `photosArePlaceholder`（`src/config/site.ts`）… 写真の「※写真はイメージです」
- `menuIsSample`（`src/data/menu.ts`）… メニューの「サンプル価格」
- `shopIsPlaceholder` と各行の `placeholder`（`src/data/shop.ts`）… 店舗情報の「仮」

### 予約

`src/config/reservation.ts` の `phone` / `webUrl` を入れると、予約セクションのボタンが有効になります
（未設定のボタンは「受付準備中」表示）。サイト内の「予約する」ボタンはすべて `/#reserve` に集まります。
住所が確定すると Google Maps ボタンも自動で有効になります（`mapUrl` を直接指定も可）。

## 写真について（重要）

`public/images/` の画像は **撮影写真ではなく、プログラムで描いた仮のイメージ** です
（作業環境から写真素材サイトにアクセスできなかったため）。実際の料理・店内写真に差し替えてください。

- 同じファイル名で上書きすれば、コードの変更は不要です。
- 推奨サイズ: ヒーロー `hero.webp` 2000×1250（横長）、`hero-sp.webp` 1080×1620（スマホ用縦長）、
  メニュー `menu/*.webp` 960×720（4:3）、その他 1200〜1600px 程度。WebP 推奨。
- 写真が明るい場合は、ヒーローの文字が読みにくくならないか確認してください（`Hero.tsx` のグラデーションで調整）。

## デプロイ（Netlify など）

静的サイトなので `out/` をそのまま配信できます。Netlify の場合は Base directory を `yakiniku`、
Build command `npm run build`、Publish directory `out` に設定してください。
本番ドメイン決定後、環境変数 `NEXT_PUBLIC_SITE_URL` を設定（canonical / OGP に使用）。
