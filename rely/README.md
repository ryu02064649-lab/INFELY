# RELY — PRIVATE RESEARCH & CONCIERGE

RELY のブランドサイト（1ページ構成 + 依頼フォーム）。
Next.js (App Router, static export) / TypeScript / Tailwind CSS v4。

## 開発

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # out/ に静的サイトを出力
npm run lint
npm test           # データ・フォーム処理のユニットテスト
npm run typecheck
```

## 構成

```
src/
  app/                 layout（フォント・メタデータ）, page, request/, request/thanks/, robots, sitemap, OGP画像, favicon
  components/
    layout/            Header（PCナビ / モバイルメニュー）, Footer, MobileRequestBar（スマホ固定CTA）
    sections/          Hero, Concept, Services, HowItWorks, Example, Pricing, FinalCta
    request/           RequestForm
    ui/                SectionHeading, ServiceRail, CandidateTabs, RevealObserver
  config/
    site.ts            ブランド名・コピー・サイトURL
    form.ts            フォーム送信先（Netlify Forms ⇄ 他サービスの切り替え）
  data/                services / pricing / steps / example / navigation（文言・価格はここだけ編集）
  lib/                 フォーム送信・バリデーション
public/images/         写真（同名ファイルで差し替え可能）
```

## 文言・価格の変更

- サービス内容: `src/data/services.ts`
- 価格: `src/data/pricing.ts`
- EXAMPLE: `src/data/example.ts`
  - 現在の RESTAURANT A/B/C は「提案形式のイメージ」です。実在店舗を掲載する場合は、必ず実際の最新情報に置き換えてください。

## 写真

`public/images/` の画像（hero / dining / stay / experience / gift / research / concept）は、
写真素材の代わりにプログラムで生成した暗めの抽象イメージです。
本番用の写真に差し替える場合は、同じファイル名（`.webp`）で上書きするか、`src/data/services.ts` の `image.src` を変更してください。
推奨: 低彩度・暗め、縦長 4:5（サービス）、横長 16:10（Hero）。

## フォーム（Netlify Forms）

- フォームは `/request/` の静的 HTML に `data-netlify="true"` 付きで出力されるため、Netlify がデプロイ時に自動検出します。
- 受信通知（メール等）は Netlify 管理画面 → Forms で設定してください。
- 送信先を変更する場合は `src/config/form.ts` の `provider` / `endpoint` を変更します。

## デプロイ（Netlify）

1. Netlify でこのリポジトリを接続
2. **Base directory を `rely`** に設定（ビルド設定は `rely/netlify.toml` から読み込まれます）
3. 本番ドメイン決定後、環境変数 `NEXT_PUBLIC_SITE_URL` を設定（canonical / OGP に使用）
