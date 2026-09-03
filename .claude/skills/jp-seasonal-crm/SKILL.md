---
name: jp-seasonal-crm
description: 日本式の季節の挨拶 CRM。Gmail/Google Calendar MCP を使い、年賀・寒中・暑中・残暑・年末・誕生日・開業記念日などの「出すべき挨拶」を判定し、Gmail の下書きを作る。送信は絶対にしない。「季節の挨拶」「残暑見舞い」「年賀メール」「CRM を回して」「誰に挨拶を出すべき」と言われたら使う。
---

# 季節の挨拶 CRM（Claude Code / Codex 共通手順）

前提: Gmail と Google Calendar の MCP が接続済み。連絡先マスタは `crm/contacts.local.json`（無ければ `crm/contacts.example.json` で動作確認のみ）。

## 絶対ルール
1. **送信しない。** `send_message` / `reply` は使わない。作るのは `create_draft` だけ。送信は人が Gmail で確認して押す。
2. **公開リポジトリに実名・メールアドレスを書かない。** 連絡先は `crm/contacts.local.json`（gitignore 済み）のみ。レポートや commit に個人情報を残さない。
3. **窓口を過ぎた挨拶は出さない。** 立秋以降の「暑中」、松の内以降の「年賀」は誤り。`crm/due.mjs` の判定に従う。
4. **喪中の相手に「おめでとう」を送らない。** `mourning_until` が設定されていれば年賀→寒中見舞いに自動で切り替わる。

## 手順

### 1. 判定
```
node crm/due.mjs --lookahead 7 --json
```
`status: open` が今日出せるもの、`upcoming` が近日窓口が開くもの。`note` に「送付済み」「喪中」があるものは飛ばす。

### 2. 重複チェック（Gmail）
候補ごとに `search_threads` で `to:<email> after:<窓口開始日> subject:(<挨拶語>)` を検索し、既に送っていれば `history` に追記して飛ばす。

### 3. 個別の一言（personal_line）を作る
- `personal_notes` と直近の `search_threads` `to:<email> newer_than:1y` の件名から、相手と最後に何をしたかを1文にする。
- Tier A: 本文全体を相手専用に書き直す。Tier B: テンプレ＋一言。Tier C: 出さない（年賀のみ等）。
- 文体は本人の過去メール（丁寧・「！」を1〜2箇所・具体的な感謝を1行）に合わせる。

### 4. 下書き作成
`crm/templates/<template>.md` を読み、`{{name}}` `{{honorific}}` `{{personal_line}}` `{{reiwa}}` `{{signature}}` を埋めて `create_draft`（`to`, `subject`, `body`）。件名は `seasons.json` の `subject`。
作成後、ラベル `CRM/季節挨拶`（無ければ `create_label`）を `label_message` で付ける。

### 5. 記録
`crm/contacts.local.json` の該当 contact の `history` に `{occasion, year, drafted_at, gmail_thread_id}` を追記する。送信確認後に `sent_at` を人が埋める（または次回実行時に `in:sent` 検索で自動補完）。

### 6. 報告
ユーザーには「作成した下書きの件数・相手・件名」と「飛ばした理由」を一覧で返す。本文は貼らない（Gmail で見るため）。

## 予定登録（任意）
年間の窓口を Google Calendar に入れる場合は `create_event`（allDay, 毎年 RRULE）で「残暑見舞い 窓口 8/7〜8/31」のように**窓口の開始日**に終日イベントを置く。節気依存の日付は毎年 `seasons.json` を更新してから。

## 定期実行
Routine（cron）で毎週月曜 09:00 JST（UTC 0:00 月曜 = `0 0 * * 1`）にこの skill を `--lookahead 7` で実行し、下書きがあれば通知する。
