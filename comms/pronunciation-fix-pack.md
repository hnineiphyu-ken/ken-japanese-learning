# Japanese site — pronunciation fix pack (ready for Kei)

Prepared 2026-11-13 (evening MMT) from the local ken-japanese-learning checkout (branch `hep`, HEAD `773ca39`).
Follows up the full pronunciation audit already sent to Kei in `comms/to-kei.md` (commit `773ca39`, 2026-11-13 17:31 MMT).
No code or data was changed — this is a ready-to-apply correction table. Ken's rule stands: Zoro does not edit the site code directly; Kei assigns/applies.

## What this adds to the audit note

The audit note described the problems. This pack gives the exact replacement values, so the fix is apply-not-investigate:
- **84 verbs**: every `rd` that stores te/ta forms, with the verified dictionary-form reading.
- **上着**: wrong reading in both datasets.
- **6 Latin abbreviations**: kana readings.
- **17 bracket entries** (Minna L21–25): cleaned readings with the bracketed context removed or folded in.

## How the 84 verb readings were verified (no guessing)

1. Each verb's `rom` field already holds the dictionary-form romaji (e.g. 会う → `au`, 食べる → `taberu`). Converted romaji → hiragana.
2. Each derived dictionary form was then conjugated back to te/ta using the verb's group (`cat` field) and compared against the kana reading of the stored te/ta `rd`. 82 of 84 reproduce the stored forms exactly.
3. The 2 exceptions are explained, not glossed over (see below). MINNA holds no duplicate of any of these 84 verb entries, so there was no second dataset to cross-check against — the te/ta reproduction is the check.

### Exceptions (2)

- **教える** (`おしえる`): data labels it "Verbs Group 1", but its stored te/ta forms (教えて / 教えた) are Group 2 conjugation — the label is wrong, not the reading. Proposed `rd` おしえる is correct; the `cat` should also change to "Verbs Group 2".
- **来る** (`くる`): irregular — the kanji 来 reads く in the dictionary form but き in te/ta forms (きて / きた), so the mechanical check could not reproduce the stored forms. Proposed `rd` くる is the standard dictionary reading, confirmed by `rom: kuru`.

## Table 1 — 84 verbs: `rd` te/ta form → dictionary reading

Apply to `src/data/wordsData.js` WORDS entries (MINNA has none of these 84 verbs). Keep the te/ta forms only if a separate display field is added; otherwise replace `rd` outright — `speech.js` speaks `rd` as-is and does not strip `/`.

| jp | current rd | proposed rd | rom | cat |
|---|---|---|---|---|
| 上げる | 上げて / 上げた | **あげる** | ageru | Verbs Group 2 |
| 開ける | 開けて / 開けた | **あける** | akeru | Verbs Group 2 |
| 洗う | 洗って / 洗った | **あらう** | arau | Verbs Group 1 |
| 歩く | 歩いて / 歩いた | **あるく** | aruku | Verbs Group 1 |
| 遊ぶ | 遊んで / 遊んだ | **あそぶ** | asobu | Verbs Group 1 |
| 集める | 集めて / 集めた | **あつめる** | atsumeru | Verbs Group 2 |
| 会う | 会って / 会った | **あう** | au | Verbs Group 1 |
| 勉強する | 勉強して / 勉強した | **べんきょうする** | benkyou suru | Verbs Irregular |
| 出す | 出して / 出した | **だす** | dasu | Verbs Group 1 |
| 出かける | 出かけて / 出かけた | **でかける** | dekakeru | Verbs Group 2 |
| 電話する | 電話して / 電話した | **でんわする** | denwa suru | Verbs Irregular |
| 出る | 出て / 出た | **でる** | deru | Verbs Group 2 |
| 吹く | 吹いて / 吹いた | **ふく** | fuku | Verbs Group 1 |
| 降る | 降って / 降った | **ふる** | furu | Verbs Group 1 |
| 入る | 入って / 入った | **はいる** | hairu | Verbs Group 1 |
| 話す | 話して / 話した | **はなす** | hanasu | Verbs Group 1 |
| 払う | 払って / 払った | **はらう** | harau | Verbs Group 1 |
| 引く | 引いて / 引いた | **ひく** | hiku | Verbs Group 1 |
| 弾く | 弾いて / 弾いた | **ひく** | hiku | Verbs Group 1 |
| 行く | 行って / 行った | **いく** | iku | Verbs Group 1 |
| いる | いて / いた | **いる** | iru | Verbs Group 2 |
| 急ぐ | 急いで / 急いだ | **いそぐ** | isogu | Verbs Group 1 |
| 言う | 言って / 言った | **いう** | iu | Verbs Group 1 |
| 帰る | 帰って / 帰った | **かえる** | kaeru | Verbs Group 1 |
| 買い物する | 買い物して / 買い物した | **かいものする** | kaimono suru | Verbs Irregular |
| 書く | 書いて / 書いた | **かく** | kaku | Verbs Group 1 |
| 考える | 考えて / 考えた | **かんがえる** | kangaeru | Verbs Group 2 |
| 貸す | 貸して / 貸した | **かす** | kasu | Verbs Group 1 |
| 買う | 買って / 買った | **かう** | kau | Verbs Group 1 |
| 消す | 消して / 消した | **けす** | kesu | Verbs Group 1 |
| 聞く | 聞いて / 聞いた | **きく** | kiku | Verbs Group 1 |
| 切る | 切って / 切った | **きる** | kiru | Verbs Group 1 |
| 着る | 着て / 着た | **きる** | kiru | Verbs Group 2 |
| 来る | 来て / 来た | **くる** | kuru | Verbs Irregular ⚠️ irregular reading change |
| 待つ | 待って / 待った | **まつ** | matsu | Verbs Group 1 |
| 見る | 見て / 見た | **みる** | miru | Verbs Group 2 |
| 見せる | 見せて / 見せた | **みせる** | miseru | Verbs Group 2 |
| もらえる | もらえて / もらえた | **もらえる** | moraeru | Verbs Group 2 |
| もらう | もらって / もらった | **もらう** | morau | Verbs Group 1 |
| 持つ | 持って / 持った | **もつ** | motsu | Verbs Group 1 |
| 迎える | 迎えて / 迎えた | **むかえる** | mukaeru | Verbs Group 2 |
| 飲む | 飲んで / 飲んだ | **のむ** | nomu | Verbs Group 1 |
| 乗る | 乗って / 乗った | **のる** | noru | Verbs Group 1 |
| 覚える | 覚えて / 覚えた | **おぼえる** | oboeru | Verbs Group 2 |
| 落ちる | 落ちて / 落ちた | **おちる** | ochiru | Verbs Group 2 |
| 起きる | 起きて / 起きた | **おきる** | okiru | Verbs Group 2 |
| 怒る | 怒って / 怒った | **おこる** | okoru | Verbs Group 1 |
| 起こす | 起こして / 起こした | **おこす** | okosu | Verbs Group 1 |
| 送る | 送って / 送った | **おくる** | okuru | Verbs Group 1 |
| 思う | 思って / 思った | **おもう** | omou | Verbs Group 1 |
| 降りる | 降りて / 降りた | **おりる** | oriru | Verbs Group 2 |
| 教える | 教えて / 教えた | **おしえる** | oshieru | Verbs Group 1 ⚠️ cat should be Group 2 |
| 終わる | 終わって / 終わった | **おわる** | owaru | Verbs Group 1 |
| 泳ぐ | 泳いで / 泳いだ | **およぐ** | oyogu | Verbs Group 1 |
| 旅行する | 旅行して / 旅行した | **りょこうする** | ryokou suru | Verbs Irregular |
| 料理する | 料理して / 料理した | **りょうりする** | ryouri suru | Verbs Irregular |
| 散歩する | 散歩して / 散歩した | **さんぽする** | sanpo suru | Verbs Irregular |
| 仕事する | 仕事して / 仕事した | **しごとする** | shigoto suru | Verbs Irregular |
| 閉める | 閉めて / 閉めた | **しめる** | shimeru | Verbs Group 2 |
| 死ぬ | 死んで / 死んだ | **しぬ** | shinu | Verbs Group 1 |
| 知る | 知って / 知った | **しる** | shiru | Verbs Group 1 |
| 住む | 住んで / 住んだ | **すむ** | sumu | Verbs Group 1 |
| する | して / した | **する** | suru | Verbs Irregular |
| 吸う | 吸って / 吸った | **すう** | suu | Verbs Group 1 |
| 座る | 座って / 座った | **すわる** | suwaru | Verbs Group 1 |
| 食べる | 食べて / 食べた | **たべる** | taberu | Verbs Group 2 |
| 立つ | 立って / 立った | **たつ** | tatsu | Verbs Group 1 |
| 手伝う | 手伝って / 手伝った | **てつだう** | tetsudau | Verbs Group 1 |
| 飛ぶ | 飛んで / 飛んだ | **とぶ** | tobu | Verbs Group 1 |
| 泊まる | 泊まって / 泊まった | **とまる** | tomaru | Verbs Group 1 |
| 止める | 止めて / 止めた | **とめる** | tomeru | Verbs Group 2 |
| 取る | 取って / 取った | **とる** | toru | Verbs Group 1 |
| 使う | 使って / 使った | **つかう** | tsukau | Verbs Group 1 |
| 作る | 作って / 作った | **つくる** | tsukuru | Verbs Group 1 |
| 生まれる | 生まれて / 生まれた | **うまれる** | umareru | Verbs Group 2 |
| 運動する | 運動して / 運動した | **うんどうする** | undou suru | Verbs Irregular |
| 分かる | 分かって / 分かった | **わかる** | wakaru | Verbs Group 1 |
| 忘れる | 忘れて / 忘れた | **わすれる** | wasureru | Verbs Group 2 |
| 渡る | 渡って / 渡った | **わたる** | wataru | Verbs Group 1 |
| 渡す | 渡して / 渡した | **わたす** | watasu | Verbs Group 1 |
| やめる | やめて / やめた | **やめる** | yameru | Verbs Group 2 |
| やる | やって / やった | **やる** | yaru | Verbs Group 1 |
| 呼ぶ | 呼んで / 呼んだ | **よぶ** | yobu | Verbs Group 1 |
| 読む | 読んで / 読んだ | **よむ** | yomu | Verbs Group 1 |

## Table 2 — 上着 (both datasets)

| jp | current rd | proposed rd | where |
|---|---|---|---|
| 上着 | うえちゃく | **うわぎ** | WORDS (Minna L17) and MINNA (L17) — `rom: uwagi` was already correct |

## Table 3 — Latin abbreviations: kana readings (both datasets)

| jp | current rd | proposed rd | note |
|---|---|---|---|
| CD | CD | **シーディー** | `rom: shiidii` already kana-equivalent |
| ATM | ATM | **エーティーエム** | `rom: eetiiemu` already kana-equivalent |
| JR | JR | **ジェイアール** | `rom: jei aaru` already kana-equivalent |
| IMC | IMC | **アイエムシー** | `rom` is also Latin (`IMC`) — kana derived from the letters |
| AKC | AKC | **エーケーシー** | `rom` is also Latin (`AKC`) — kana derived from the letters |
| ABC ストア | ABC ストア | **エービーシー ストア** | `rom: ABC sutoa` — only the ABC part needs kana |

## Table 4 — 17 bracket entries: cleaned readings (both datasets)

Rule used: bracketed example-context phrases (e.g. ［お祭りが～］, ［先生に］, ［～たら］) are dropped — they are usage examples, not part of the word. Bracketed parts that belong to the word itself (［お］, ［ございます］, ［いろいろ］) are folded in without brackets. The ［な］ in 無駄［な］ / 不便［な］ is the na-adjective marker, not part of the reading, so it is dropped.

| jp | current rd | proposed rd |
|---|---|---|
| あります［お祭りが～］ | あります［おまつりが～］ | **あります** |
| やめます［会社を～］ | やめます［かいしゃを～］ | **やめます** |
| 無駄［な］ | むだ［な］ | **むだ** |
| 不便［な］ | ふべん［な］ | **ふべん** |
| かけます［めがねを～］ | かけます［めがねを～］ | **かけます** |
| します［ネクタイを～］ | します［ネクタイを～］ | **します** |
| ［お］弁当 | ［お］べんとう | **おべんとう** |
| おめでとう［ございます］ | おめでとう［ございます］ | **おめでとうございます** |
| 聞きます［先生に］ | ききます［せんせいに］ | **ききます** |
| 出ます［お釣りが～］ | でます［おつりが～］ | **でます** |
| 渡ります［橋を～］ | わたります［はしを～］ | **わたります** |
| 曲がります［右へ～］ | まがります［みぎへ～］ | **まがります** |
| ［お］湯 | ［お］ゆ | **おゆ** |
| ［お］菓子 | ［お］かし | **おかし** |
| 取ります［年を～］ | とります［としを～］ | **とります** |
| もし［～たら］ | もし［～たら］ | **もし** |
| ［いろいろ］お世話になりました | ［いろいろ］おせわになりました | **いろいろおせわになりました** |

## Out of scope / not changed

- Counter and time entries starting with 〜 (e.g. 〜つ → 〜つ, 〜本 → 〜ほん/ぼん/ぽん) were left alone: the 〜 is a number placeholder, not a bracket error, and the audit did not flag them. If TTS reads them oddly they are a separate decision.
- `…はい` / `…いいえ`, `もう帰らないと…`, `[～は]ちょっと…` and `たり〜たりする` still carry leading `…` / `〜` in `rd`; the audit suggested stripping those in `cleanText` in `speech.js` rather than editing data — left for Kei to decide with the code fix.
- The greeting `おかえり / おかえりなさい` (the one non-verb ` / ` entry) is fine as-is — both are valid spoken forms.

## Suggested next step for Ken

Send this pack to Kei as a follow-up to the `773ca39` audit note (same `comms/to-kei.md`, hep branch), or hand it to whoever applies the fix. The file lives at `~/workspace/your_files/japanese-pronunciation-fix/verb-rd-corrections.md`.
