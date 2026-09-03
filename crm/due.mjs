#!/usr/bin/env node
// 季節の挨拶 CRM: 「今日、誰に、どの挨拶を出すべきか」を計算する。
// 使い方:
//   node crm/due.mjs                       # 今日（JST）
//   node crm/due.mjs --date 2027-01-02     # 日付指定
//   node crm/due.mjs --contacts crm/contacts.local.json --json
//   node crm/due.mjs --lookahead 14        # 14日以内に窓口が開くものも表示
// 副作用なし。Gmail/Calendar への書き込みは Claude/Codex 側（skill）が draft として行う。
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]?.startsWith('--') || arr[i + 1] === undefined ? true : arr[i + 1]]);
    return acc;
  }, []),
);

const seasons = JSON.parse(readFileSync(join(here, 'seasons.json'), 'utf8'));
const contactsPath = args.contacts ?? (existsSync(join(here, 'contacts.local.json')) ? join(here, 'contacts.local.json') : join(here, 'contacts.example.json'));
const book = JSON.parse(readFileSync(contactsPath, 'utf8'));

const todayJst = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
const today = typeof args.date === 'string' ? new Date(args.date + 'T00:00:00') : todayJst();
today.setHours(0, 0, 0, 0);
const lookahead = Number(args.lookahead ?? 0);

const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const reiwa = (y) => y - 2018;

// "MM-DD" | "risshu" | "risshu-1" | "09-3mon" → Date in the given year
function resolve(spec, year) {
  const terms = seasons.solar_terms[String(year)];
  const m = /^([a-z]+)([+-]\d+)?$/.exec(spec);
  if (m && terms && terms[m[1]]) return addDays(new Date(terms[m[1]] + 'T00:00:00'), Number(m[2] ?? 0));
  const w = /^(\d{2})-(\d)(mon|tue|wed|thu|fri|sat|sun)$/.exec(spec);
  if (w) {
    const dow = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(w[3]);
    const first = new Date(year, Number(w[1]) - 1, 1);
    const offset = (dow - first.getDay() + 7) % 7;
    return new Date(year, Number(w[1]) - 1, 1 + offset + 7 * (Number(w[2]) - 1));
  }
  const md = /^(\d{2})-(\d{2})$/.exec(spec);
  if (md) return new Date(year, Number(md[1]) - 1, Number(md[2]));
  throw new Error(`unresolvable date spec "${spec}" for ${year} (solar term table missing?)`);
}

function windowsFor(occ, year, region) {
  const list = occ.windows ?? [occ.window];
  return list.map((w) => {
    const startKey = region === 'kansai' && w.start_kansai ? 'start_kansai' : 'start';
    const endKey = region === 'kansai' && w.end_kansai ? 'end_kansai' : 'end';
    const start = resolve(w[startKey], year);
    let end = resolve(w[endKey], year);
    if (w.hard_end) end = resolve(w.hard_end, year); // 8月末が基本だが白露前日までは許容
    return { label: w.label, start, end, preferred: w.preferred };
  });
}

function personalDate(contact, field, year) {
  const raw = contact.dates?.[field];
  if (!raw) return null;
  const m = /(\d{4})?-?-(\d{2})-(\d{2})$/.exec(raw);
  if (!m) return null;
  return { date: new Date(year, Number(m[2]) - 1, Number(m[3])), origin: m[1] ? Number(m[1]) : null };
}

const isMourning = (c, d) => c.mourning_until && d <= new Date(c.mourning_until + 'T23:59:59');
const alreadySent = (c, occId, year) => (c.history ?? []).some((h) => h.occasion === occId && h.year === year);

const results = [];
const year = today.getFullYear();
for (const c of book.contacts) {
  const wanted = new Set(c.occasions ?? []);
  for (const occ of seasons.occasions) {
    if (!wanted.has(occ.id)) continue;
    let items = [];
    if (occ.kind === 'personal') {
      const p = personalDate(c, occ.date_field, year);
      if (!p) continue;
      items = [{ start: p.date, end: p.date, years: p.origin ? year - p.origin : null }];
    } else {
      items = windowsFor(occ, year, c.region);
      // 年始の挨拶は年末に「翌年分」も先読みする
      if (occ.id === 'shinnen' && today.getMonth() === 11) items.push(...windowsFor(occ, year + 1, c.region));
    }
    for (const w of items) {
      const status = today < w.start ? (today >= addDays(w.start, -lookahead) ? 'upcoming' : null) : today <= w.end ? 'open' : null;
      if (!status) continue;
      const y = w.start.getFullYear();
      let action = occ.id, note = '';
      if (alreadySent(c, occ.id, y)) { note = '送付済み'; }
      else if (occ.id === 'shinnen' && (isMourning(c, w.start) || isMourning(book.sender, w.start))) { action = 'kanchu'; note = '喪中のため年賀→寒中見舞い（1/8以降）'; }
      else if (occ.id === 'zansho' && alreadySent(c, 'shochu', y)) { note = '暑中見舞い送付済みのため不要'; }
      results.push({
        contact: c.id, name: `${c.name}${c.honorific ?? '様'}`, email: c.email, tier: c.tier,
        occasion: occ.id, action, label: occ.label, status,
        window: `${iso(w.start)}..${iso(w.end)}`, days_left: Math.round((w.end - today) / 864e5), days_to_start: Math.round((w.start - today) / 864e5),
        years: w.years ?? null, subject: occ.subject.replace('{{sender_name}}', book.sender.name).replace('{{years}}', w.years ?? ''),
        template: seasons.occasions.find((o) => o.id === action)?.template ?? occ.template, note,
      });
    }
  }
}
results.sort((a, b) => (a.status === b.status ? a.days_left - b.days_left : a.status === 'open' ? -1 : 1));

if (args.json) { console.log(JSON.stringify({ date: iso(today), reiwa: reiwa(year), results }, null, 2)); process.exit(0); }
console.log(`基準日: ${iso(today)}（令和${reiwa(year)}年）  連絡先: ${book.contacts.length}件  出典: ${contactsPath}`);
if (!results.length) { console.log('今日出すべき季節の挨拶はありません。'); process.exit(0); }
const rows = results.map((r) => [
  r.status === 'open' ? `残${r.days_left}日` : `${r.days_to_start}日後`,
  r.name, r.label + (r.years ? `（${r.years}周年）` : '') + (r.action !== r.occasion ? ` → ${r.action}` : ''), r.window, r.note || '',
]);
for (const row of [['状態', '相手', '挨拶', '窓口', '備考'], ...rows]) console.log(row.join('\t'));
