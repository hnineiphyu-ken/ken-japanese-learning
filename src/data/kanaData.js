export const KANA_ROWS = [
  { label: "a · i · u · e · o", items: [["あ", "ア", "a"], ["い", "イ", "i"], ["う", "ウ", "u"], ["え", "エ", "e"], ["お", "オ", "o"]] },
  { label: "K", items: [["か", "カ", "ka"], ["き", "キ", "ki"], ["く", "ク", "ku"], ["け", "ケ", "ke"], ["こ", "コ", "ko"]] },
  { label: "S", items: [["さ", "サ", "sa"], ["し", "シ", "shi"], ["す", "ス", "su"], ["せ", "セ", "se"], ["そ", "ソ", "so"]] },
  { label: "T", items: [["た", "タ", "ta"], ["ち", "チ", "chi"], ["つ", "ツ", "tsu"], ["て", "テ", "te"], ["と", "ト", "to"]] },
  { label: "N", items: [["な", "ナ", "na"], ["に", "ニ", "ni"], ["ぬ", "ヌ", "nu"], ["ね", "ネ", "ne"], ["の", "ノ", "no"]] },
  { label: "H", items: [["は", "ハ", "ha"], ["ひ", "ヒ", "hi"], ["ふ", "フ", "fu"], ["へ", "ヘ", "he"], ["ほ", "ホ", "ho"]] },
  { label: "M", items: [["ま", "マ", "ma"], ["み", "ミ", "mi"], ["む", "ム", "mu"], ["め", "メ", "me"], ["も", "モ", "mo"]] },
  { label: "Y", items: [["や", "ヤ", "ya"], null, ["ゆ", "ユ", "yu"], null, ["よ", "ヨ", "yo"]] },
  { label: "R", items: [["ら", "ラ", "ra"], ["り", "リ", "ri"], ["る", "ル", "ru"], ["れ", "レ", "re"], ["ろ", "ロ", "ro"]] },
  { label: "W · n", items: [["わ", "ワ", "wa"], null, null, null, ["を", "ヲ", "wo"]] },
  { label: "", items: [["ん", "ン", "n"], null, null, null, null] }
];

export const DAKUTEN = [
  ["が", "ガ", "ga"], ["ぎ", "ギ", "gi"], ["ぐ", "グ", "gu"], ["げ", "ゲ", "ge"], ["ご", "ゴ", "go"],
  ["ざ", "ザ", "za"], ["じ", "ジ", "ji"], ["ず", "ズ", "zu"], ["ぜ", "ゼ", "ze"], ["ぞ", "ゾ", "zo"],
  ["だ", "ダ", "da"], ["ぢ", "ヂ", "ji"], ["づ", "ヅ", "zu"], ["で", "デ", "de"], ["ど", "ド", "do"],
  ["ば", "バ", "ba"], ["び", "ビ", "bi"], ["ぶ", "ブ", "bu"], ["べ", "ベ", "be"], ["ぼ", "ボ", "bo"],
  ["ぱ", "パ", "pa"], ["ぴ", "ピ", "pi"], ["ぷ", "プ", "pu"], ["ぺ", "ペ", "pe"], ["ぽ", "ポ", "po"]
];

export const YOON = [
  [["きゃ", "キャ", "kya"], ["きゅ", "キュ", "kyu"], ["きょ", "キョ", "kyo"]],
  [["しゃ", "シャ", "sha"], ["しゅ", "シュ", "shu"], ["しょ", "ショ", "sho"]],
  [["ちゃ", "チャ", "cha"], ["ちゅ", "チュ", "chu"], ["ちょ", "チョ", "cho"]],
  [["にゃ", "ニャ", "nya"], ["にゅ", "ニュ", "nyu"], ["にょ", "ニョ", "nyo"]],
  [["ひゃ", "ヒャ", "hya"], ["ひゅ", "ヒュ", "hyu"], ["ひょ", "ヒョ", "hyo"]],
  [["みゃ", "ミャ", "mya"], ["みゅ", "ミュ", "myu"], ["みょ", "ミョ", "myo"]],
  [["りゃ", "リャ", "rya"], ["りゅ", "リュ", "ryu"], ["りょ", "リョ", "ryo"]],
  [["ぎゃ", "ギャ", "gya"], ["ぎゅ", "ギュ", "gyu"], ["ぎょ", "ギョ", "gyo"]],
  [["じゃ", "ジャ", "ja"], ["じゅ", "ジュ", "ju"], ["じょ", "ジョ", "jo"]],
  [["びゃ", "ビャ", "bya"], ["びゅ", "ビュ", "byu"], ["びょ", "ビョ", "byo"]],
  [["ぴゃ", "ピャ", "pya"], ["ぴゅ", "ピュ", "pyu"], ["ぴょ", "ピョ", "pyo"]]
];

export const SPECIAL_KATA = [
  [null, "シャ", "sha"], [null, "シ", "shi"], [null, "シュ", "shu"], [null, "シェ", "she"], [null, "ショ", "sho"],
  [null, "チャ", "cha"], [null, "チ", "chi"], [null, "チュ", "chu"], [null, "チェ", "che"], [null, "チョ", "cho"],
  [null, "ファ", "fa"], [null, "フィ", "fi"], [null, "フ", "fu"], [null, "フェ", "fe"], [null, "フォ", "fo"],
  [null, "ワ", "wa"], [null, "ウィ", "wi"], [null, "ウ", "wu"], [null, "ウェ", "we"],
  [null, "ティ", "thi"], [null, "ディ", "dhi"]
];

export const LONG_VOWELS = [
  { rule: "a → a", note: "a stretches", ex: [["おかあさん", "okaasan", "mother", "အမေ"], ["おばあさん", "obaasan", "grandmother", "အဖွား"]] },
  { rule: "i → i", note: "i stretches", ex: [["おにいさん", "oniisan", "older brother", "အစ်ကို"], ["おいしい", "oishii", "delicious", "အရသာရှိတယ်"]] },
  { rule: "u → u", note: "u stretches", ex: [["ゆうひ", "yuuhi", "evening sun; sunset", "နေဝင်ချိန်"], ["せんぷうき", "senpuuki", "electric fan", "ပန်ကာ"]] },
  { rule: "e → i", note: "e+i is read as long ē — the i is not pronounced separately", ex: [["せんせい", "sensei", "teacher", "ဆရာ"], ["けいえい", "keiei", "management", "စီမံခန့်ခွဲမှု"]] },
  { rule: "o → u", note: "o+u is read as long ō — the u is not pronounced separately", ex: [["ぼうし", "boushi", "hat; cap", "ဦးထုပ်"], ["ありがとう", "arigatou", "thank you", "ကျေးဇူးတင်တယ်"]] }
];
