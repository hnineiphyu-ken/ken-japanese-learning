var KANA_ROWS=[
 {label:"a · i · u · e · o",items:[["あ","ア","a"],["い","イ","i"],["う","ウ","u"],["え","エ","e"],["お","オ","o"]]},
 {label:"K",items:[["か","カ","ka"],["き","キ","ki"],["く","ク","ku"],["け","ケ","ke"],["こ","コ","ko"]]},
 {label:"S",items:[["さ","サ","sa"],["し","シ","shi"],["す","ス","su"],["せ","セ","se"],["そ","ソ","so"]]},
 {label:"T",items:[["た","タ","ta"],["ち","チ","chi"],["つ","ツ","tsu"],["て","テ","te"],["と","ト","to"]]},
 {label:"N",items:[["な","ナ","na"],["に","ニ","ni"],["ぬ","ヌ","nu"],["ね","ネ","ne"],["の","ノ","no"]]},
 {label:"H",items:[["は","ハ","ha"],["ひ","ヒ","hi"],["ふ","フ","fu"],["へ","ヘ","he"],["ほ","ホ","ho"]]},
 {label:"M",items:[["ま","マ","ma"],["み","ミ","mi"],["む","ム","mu"],["め","メ","me"],["も","モ","mo"]]},
 {label:"Y",items:[["や","ヤ","ya"],null,["ゆ","ユ","yu"],null,["よ","ヨ","yo"]]},
 {label:"R",items:[["ら","ラ","ra"],["り","リ","ri"],["る","ル","ru"],["れ","レ","re"],["ろ","ロ","ro"]]},
 {label:"W · n",items:[["わ","ワ","wa"],null,null,null,["を","ヲ","wo"]]},
 {label:"",items:[["ん","ン","n"],null,null,null,null]}
];
var DAKUTEN=[
 ["が","ガ","ga"],["ぎ","ギ","gi"],["ぐ","グ","gu"],["げ","ゲ","ge"],["ご","ゴ","go"],
 ["ざ","ザ","za"],["じ","ジ","ji"],["ず","ズ","zu"],["ぜ","ゼ","ze"],["ぞ","ゾ","zo"],
 ["だ","ダ","da"],["ぢ","ヂ","ji"],["づ","ヅ","zu"],["で","デ","de"],["ど","ド","do"],
 ["ば","バ","ba"],["び","ビ","bi"],["ぶ","ブ","bu"],["べ","ベ","be"],["ぼ","ボ","bo"],
 ["ぱ","パ","pa"],["ぴ","ピ","pi"],["ぷ","プ","pu"],["ぺ","ペ","pe"],["ぽ","ポ","po"]
];
var YOON=[
 [["きゃ","キャ","kya"],["きゅ","キュ","kyu"],["きょ","キョ","kyo"]],
 [["しゃ","シャ","sha"],["しゅ","シュ","shu"],["しょ","ショ","sho"]],
 [["ちゃ","チャ","cha"],["ちゅ","チュ","chu"],["ちょ","チョ","cho"]],
 [["にゃ","ニャ","nya"],["にゅ","ニュ","nyu"],["にょ","ニョ","nyo"]],
 [["ひゃ","ヒャ","hya"],["ひゅ","ヒュ","hyu"],["ひょ","ヒョ","hyo"]],
 [["みゃ","ミャ","mya"],["みゅ","ミュ","myu"],["みょ","ミョ","myo"]],
 [["りゃ","リャ","rya"],["りゅ","リュ","ryu"],["りょ","リョ","ryo"]],
 [["ぎゃ","ギャ","gya"],["ぎゅ","ギュ","gyu"],["ぎょ","ギョ","gyo"]],
 [["じゃ","ジャ","ja"],["じゅ","ジュ","ju"],["じょ","ジョ","jo"]],
 [["びゃ","ビャ","bya"],["びゅ","ビュ","byu"],["びょ","ビョ","byo"]],
 [["ぴゃ","ピャ","pya"],["ぴゅ","ピュ","pyu"],["ぴょ","ピョ","pyo"]]
];
/* Katakana-only combinations for foreign words: [hiragana(null), katakana, romaji] */
var SPECIAL_KATA=[
 [null,"シャ","sha"],[null,"シ","shi"],[null,"シュ","shu"],[null,"シェ","she"],[null,"ショ","sho"],
 [null,"チャ","cha"],[null,"チ","chi"],[null,"チュ","chu"],[null,"チェ","che"],[null,"チョ","cho"],
 [null,"ファ","fa"],[null,"フィ","fi"],[null,"フ","fu"],[null,"フェ","fe"],[null,"フォ","fo"],
 [null,"ワ","wa"],[null,"ウィ","wi"],[null,"ウ","wu"],[null,"ウェ","we"],
 [null,"ティ","thi"],[null,"ディ","dhi"]
];
var LONG_VOWELS=[
 {rule:"a → a",note:"a stretches",ex:[["おかあさん","okaasan","mother","အမေ"],["おばあさん","obaasan","grandmother","အဖွား"]]},
 {rule:"i → i",note:"i stretches",ex:[["おにいさん","oniisan","older brother","အစ်ကို"],["おいしい","oishii","delicious","အရသာရှိတယ်"]]},
 {rule:"u → u",note:"u stretches",ex:[["ゆうひ","yuuhi","evening sun; sunset","နေဝင်ချိန်"],["せんぷうき","senpuuki","electric fan","ပန်ကာ"]]},
 {rule:"e → i",note:"e+i is read as long ē — the i is not pronounced separately",ex:[["せんせい","sensei","teacher","ဆရာ"],["けいえい","keiei","management","စီမံခန့်ခွဲမှု"]]},
 {rule:"o → u",note:"o+u is read as long ō — the u is not pronounced separately",ex:[["ぼうし","boushi","hat; cap","ဦးထုပ်"],["ありがとう","arigatou","thank you","ကျေးဇူးတင်တယ်"]]}
];
/* Reference tables from class notes — [label, kana, romaji, meaning] */
var NUM_TABLE=[
 ["0","ゼロ・れい","zero / rei","zero · သုည"],["1","いち","ichi","one · တစ်"],["2","に","ni","two · နှစ်"],["3","さん","san","three · သုံး"],["4","よん・し","yon / shi","four · လေး"],["5","ご","go","five · ငါး"],["6","ろく","roku","six · ခြောက်"],["7","なな・しち","nana / shichi","seven · ခုနှစ်"],["8","はち","hachi","eight · ရှစ်"],["9","きゅう・く","kyuu / ku","nine · ကိုး"],["10","じゅう","juu","ten · ဆယ်"],
 ["11","じゅういち","juu-ichi","eleven · ဆယ့်တစ်"],["12","じゅうに","juu-ni","twelve · ဆယ့်နှစ်"],["13","じゅうさん","juu-san","thirteen · ဆယ့်သုံး"],["14","じゅうよん・じゅうし","juu-yon / juu-shi","fourteen · ဆယ့်လေး"],["15","じゅうご","juu-go","fifteen · ဆယ့်ငါး"],["16","じゅうろく","juu-roku","sixteen · ဆယ့်ခြောက်"],["17","じゅうなな・じゅうしち","juu-nana / juu-shichi","seventeen · ဆယ့်ခုနှစ်"],["18","じゅうはち","juu-hachi","eighteen · ဆယ့်ရှစ်"],["19","じゅうきゅう・じゅうく","juu-kyuu / juu-ku","nineteen · ဆယ့်ကိုး"],
 ["20","にじゅう","ni-juu","twenty · နှစ်ဆယ်"],["30","さんじゅう","san-juu","thirty · သုံးဆယ်"],["40","よんじゅう","yon-juu","forty · လေးဆယ်"],["50","ごじゅう","go-juu","fifty · ငါးဆယ်"],["60","ろくじゅう","roku-juu","sixty · ခြောက်ဆယ်"],["70","ななじゅう","nana-juu","seventy · ခုနှစ်ဆယ်"],["80","はちじゅう","hachi-juu","eighty · ရှစ်ဆယ်"],["90","きゅうじゅう","kyuu-juu","ninety · ကိုးဆယ်"],
 ["100","ひゃく","hyaku","one hundred · တစ်ရာ"],["200","にひゃく","ni-hyaku","two hundred · နှစ်ရာ"],["300","さんびゃく","san-byaku","three hundred · သုံးရာ"],["400","よんひゃく","yon-hyaku","four hundred · လေးရာ"],["500","ごひゃく","go-hyaku","five hundred · ငါးရာ"],["600","ろっぴゃく","rop-pyaku","six hundred · ခြောက်ရာ"],["700","ななひゃく","nana-hyaku","seven hundred · ခုနှစ်ရာ"],["800","はっぴゃく","hap-pyaku","eight hundred · ရှစ်ရာ"],["900","きゅうひゃく","kyuu-hyaku","nine hundred · ကိုးရာ"],
 ["1,000","せん","sen","one thousand · တစ်ထောင်"],["2,000","にせん","ni-sen","two thousand · နှစ်ထောင်"],["3,000","さんぜん","san-zen","three thousand · သုံးထောင်"],["4,000","よんせん","yon-sen","four thousand · လေးထောင်"],["5,000","ごせん","go-sen","five thousand · ငါးထောင်"],["6,000","ろくせん","roku-sen","six thousand · ခြောက်ထောင်"],["7,000","ななせん","nana-sen","seven thousand · ခုနှစ်ထောင်"],["8,000","はっせん","has-sen","eight thousand · ရှစ်ထောင်"],["9,000","きゅうせん","kyuu-sen","nine thousand · ကိုးထောင်"],
 ["10,000","いちまん","ichi-man","ten thousand · တစ်သောင်း"],["100,000","じゅうまん","juu-man","100 thousand · တစ်သိန်း"],["1,000,000","ひゃくまん","hyaku-man","one million · ဆယ်သိန်း"],["10,000,000","いっせんまん","issen-man","ten million · သိန်းတစ်ရာ"],["100,000,000","いちおく","ichi-oku","100 million · တစ်ကုဋေ"],
 ["0.76","れいてん なな ろく","rei ten nana roku","zero point seven six · သုည ဒဿမ ခုနစ် ခြောက်"],["3/4","よんぶんの さん","yon-bun no san","three quarters · လေးပိုင်းမှာ သုံးပိုင်း"]
];
/* Counters (助数詞) — rows are [label, kana, romaji, English, Burmese].
   The label is the number itself (1, 2, 3 …) — no separate No. column,
   same as the Numbers table. */
var COUNTERS=[
 {jp:"〜さい",en:"Age",my:"years old · အသက်",rows:[
  ["1","いっさい","issai","1 year old","အသက် 1 နှစ်"],["2","にさい","nisai","2 years old","အသက် 2 နှစ်"],["3","さんさい","sansai","3 years old","အသက် 3 နှစ်"],["4","よんさい","yonsai","4 years old","အသက် 4 နှစ်"],["5","ごさい","gosai","5 years old","အသက် 5 နှစ်"],["6","ろくさい","rokusai","6 years old","အသက် 6 နှစ်"],["7","ななさい","nanasai","7 years old","အသက် 7 နှစ်"],["8","はっさい","hassai","8 years old","အသက် 8 နှစ်"],["9","きゅうさい","kyuusai","9 years old","အသက် 9 နှစ်"],["10","じゅっさい","jussai","10 years old","အသက် 10 နှစ်"],["20","はたち","hatachi","20 years old (special word)","အသက် 20 (အထူး)"],["?","なんさい","nan-sai","how old?","အသက်ဘယ်လောက်"]]},
 {jp:"〜にん",en:"People",my:"counting people · လူ (ယောက်)",rows:[
  ["1","ひとり","hitori","1 person","လူ 1 ယောက်"],["2","ふたり","futari","2 people","လူ 2 ယောက်"],["3","さんにん","sannin","3 people","လူ 3 ယောက်"],["4","よにん","yonin","4 people","လူ 4 ယောက်"],["5","ごにん","gonin","5 people","လူ 5 ယောက်"],["6","ろくにん","rokunin","6 people","လူ 6 ယောက်"],["7","ななにん","nananin","7 people","လူ 7 ယောက်"],["8","はちにん","hachinin","8 people","လူ 8 ယောက်"],["9","きゅうにん","kyuunin","9 people","လူ 9 ယောက်"],["10","じゅうにん","juunin","10 people","လူ 10 ယောက်"],["?","なんにん","nan-nin","how many people?","လူဘယ်နှစ်‌ယောက်"]]},
 {jp:"〜かい",en:"Floors",my:"floors of a building · အထပ်",rows:[
  ["1","いっかい","ikkai","1st floor","1 ထပ်"],["2","にかい","nikai","2nd floor","2 ထပ်"],["3","さんかい","sankai","3rd floor","3 ထပ်"],["4","よんかい","yonkai","4th floor","4 ထပ်"],["5","ごかい","gokai","5th floor","5 ထပ်"],["6","ろっかい","rokkai","6th floor","6 ထပ်"],["7","ななかい","nanakai","7th floor","7 ထပ်"],["8","はっかい","hakkai","8th floor","8 ထပ်"],["9","きゅうかい","kyuukai","9th floor","9 ထပ်"],["10","じゅっかい","jukkai","10th floor","10 ထပ်"],["?","なんかい","nan-kai","which floor?","ဘယ်အထပ်"]]},
 {jp:"〜つ",en:"Things",my:"general counter · ပစ္စည်း (ခု)",rows:[
  ["1","ひとつ","hitotsu","1 thing","1 ခု"],["2","ふたつ","futatsu","2 things","2 ခု"],["3","みっつ","mittsu","3 things","3 ခု"],["4","よっつ","yottsu","4 things","4 ခု"],["5","いつつ","itsutsu","5 things","5 ခု"],["6","むっつ","muttsu","6 things","6 ခု"],["7","ななつ","nanatsu","7 things","7 ခု"],["8","やっつ","yattsu","8 things","8 ခု"],["9","ここのつ","kokonotsu","9 things","9 ခု"],["10","とお","too","10 things","10 ခု"],["?","いくつ","ikutsu","how many things?","ဘယ်နှစ်‌ခု"]]},
 {jp:"〜まい",en:"Flat things",my:"sheets, paper, plates · ပြား (ရွက်/ချပ်)",rows:[
  ["1","いちまい","ichimai","1 sheet","1 ရွက်"],["2","にまい","nimai","2 sheets","2 ရွက်"],["3","さんまい","sanmai","3 sheets","3 ရွက်"],["4","よんまい","yonmai","4 sheets","4 ရွက်"],["5","ごまい","gomai","5 sheets","5 ရွက်"],["6","ろくまい","rokumai","6 sheets","6 ရွက်"],["7","ななまい","nanamai","7 sheets","7 ရွက်"],["8","はちまい","hachimai","8 sheets","8 ရွက်"],["9","きゅうまい","kyuu-mai","9 sheets","9 ရွက်"],["10","じゅうまい","juumai","10 sheets","10 ရွက်"],["?","なんまい","nan-mai","how many sheets?","ဘယ်နှစ်‌ရွက်"]]},
 {jp:"〜ほん",en:"Long things",my:"bottles, pens, umbrellas · ချောင်း",rows:[
  ["1","いっぽん","ippon","1 long thing","1 ချောင်း"],["2","にほん","nihon","2 long things","2 ချောင်း"],["3","さんぼん","sanbon","3 long things","3 ချောင်း"],["4","よんほん","yonhon","4 long things","4 ချောင်း"],["5","ごほん","gohon","5 long things","5 ချောင်း"],["6","ろっぽん","roppon","6 long things","6 ချောင်း"],["7","ななほん","nanahon","7 long things","7 ချောင်း"],["8","はっぽん","happon","8 long things","8 ချောင်း"],["9","きゅうほん","kyuuhon","9 long things","9 ချောင်း"],["10","じゅっぽん","juppon","10 long things","10 ချောင်း"],["?","なんぼん","nan-bon","how many long things?","ဘယ်နှစ်‌ချောင်း"]]},
 {jp:"〜ひき",en:"Small animals",my:"cats, dogs, fish · ကောင်",rows:[
  ["1","いっぴき","ippiki","1 small animal","1 ကောင်"],["2","にひき","nihiki","2 small animals","2 ကောင်"],["3","さんびき","sanbiki","3 small animals","3 ကောင်"],["4","よんひき","yonhiki","4 small animals","4 ကောင်"],["5","ごひき","gohiki","5 small animals","5 ကောင်"],["6","ろっぴき","roppiki","6 small animals","6 ကောင်"],["7","ななひき","nanahiki","7 small animals","7 ကောင်"],["8","はっぴき","happiki","8 small animals","8 ကောင်"],["9","きゅうひき","kyuuhiki","9 small animals","9 ကောင်"],["10","じゅっぴき","juppiki","10 small animals","10 ကောင်"],["?","なんびき","nan-biki","how many small animals?","ဘယ်နှစ်‌ကောင်"]]},
 {jp:"〜さつ",en:"Books",my:"books & magazines · အုပ်",rows:[
  ["1","いっさつ","issatsu","1 book","1 အုပ်"],["2","にさつ","nisatsu","2 books","2 အုပ်"],["3","さんさつ","sansatsu","3 books","3 အုပ်"],["4","よんさつ","yonsatsu","4 books","4 အုပ်"],["5","ごさつ","gosatsu","5 books","5 အုပ်"],["6","ろくさつ","rokusatsu","6 books","6 အုပ်"],["7","ななさつ","nanasatsu","7 books","7 အုပ်"],["8","はっさつ","hassatsu","8 books","8 အုပ်"],["9","きゅうさつ","kyuusatsu","9 books","9 အုပ်"],["10","じゅっさつ","jussatsu","10 books","10 အုပ်"],["?","なんさつ","nan-satsu","how many books?","ဘယ်နှစ်‌အုပ်"]]},
 {jp:"〜だい",en:"Machines & vehicles",my:"cars, computers, bikes · စီး",rows:[
  ["1","いちだい","ichidai","1 machine / vehicle","1 စီး"],["2","にだい","nidai","2 machines / vehicles","2 စီး"],["3","さんだい","sandai","3 machines / vehicles","3 စီး"],["4","よんだい","yondai","4 machines / vehicles","4 စီး"],["5","ごだい","godai","5 machines / vehicles","5 စီး"],["6","ろくだい","rokudai","6 machines / vehicles","6 စီး"],["7","ななだい","nanadai","7 machines / vehicles","7 စီး"],["8","はちだい","hachidai","8 machines / vehicles","8 စီး"],["9","きゅうだい","kyuudai","9 machines / vehicles","9 စီး"],["10","じゅうだい","juudai","10 machines / vehicles","10 စီး"],["?","なんだい","nan-dai","how many machines / vehicles?","ဘယ်နှစ်‌စီး"]]},
 {jp:"〜こ",en:"Small round things",my:"balls, eggs, boxes · လုံး",rows:[
  ["1","いっこ","ikko","1 small round thing","1 လုံး"],["2","にこ","niko","2 small round things","2 လုံး"],["3","さんこ","sanko","3 small round things","3 လုံး"],["4","よんこ","yonko","4 small round things","4 လုံး"],["5","ごこ","goko","5 small round things","5 လုံး"],["6","ろっこ","rokko","6 small round things","6 လုံး"],["7","ななこ","nanako","7 small round things","7 လုံး"],["8","はっこ","hakko","8 small round things","8 လုံး"],["9","きゅうこ","kyuuko","9 small round things","9 လုံး"],["10","じゅっこ","jukko","10 small round things","10 လုံး"],["?","なんこ","nan-ko","how many small round things?","ဘယ်နှစ်‌လုံး"]]},
 {jp:"〜はい",en:"Cups",my:"cups & glasses of drink · ခွက်",rows:[
  ["1","いっぱい","ippai","1 cup","1 ခွက်"],["2","にはい","nihai","2 cups","2 ခွက်"],["3","さんばい","sanbai","3 cups","3 ခွက်"],["4","よんはい","yonhai","4 cups","4 ခွက်"],["5","ごはい","gohai","5 cups","5 ခွက်"],["6","ろっぱい","roppai","6 cups","6 ခွက်"],["7","ななはい","nanahai","7 cups","7 ခွက်"],["8","はっぱい","happai","8 cups","8 ခွက်"],["9","きゅうはい","kyuuhai","9 cups","9 ခွက်"],["10","じゅっぱい","juppai","10 cups","10 ခွက်"],["?","なんばい","nan-bai","how many cups?","ဘယ်နှစ်‌ခွက်"]]}
];
var HOUR_TABLE=[
 ["1","いちじ","ichi-ji","1 o'clock · ၁ နာရီ"],["2","にじ","ni-ji","၂ နာရီ"],["3","さんじ","san-ji","၃ နာရီ"],["4","よじ","yo-ji","၄ နာရီ"],["5","ごじ","go-ji","၅ နာရီ"],["6","ろくじ","roku-ji","၆ နာရီ"],["7","しちじ","shichi-ji","၇ နာရီ"],["8","はちじ","hachi-ji","၈ နာရီ"],["9","くじ","ku-ji","၉ နာရီ"],["10","じゅうじ","juu-ji","၁၀ နာရီ"],["11","じゅういちじ","juu-ichi-ji","၁၁ နာရီ"],["12","じゅうにじ","juu-ni-ji","၁၂ နာရီ"],["?","なんじ","nan-ji","what time · ဘယ်နာရီ"]
];
var MIN_TABLE=[
 ["1","いっぷん","ip-pun","1 minute · ၁ မိနစ်"],["2","にふん","ni-fun","၂ မိနစ်"],["3","さんぷん","san-pun","၃ မိနစ်"],["4","よんぷん","yon-pun","၄ မိနစ်"],["5","ごふん","go-fun","၅ မိနစ်"],["6","ろっぷん","rop-pun","၆ မိနစ်"],["7","ななふん","nana-fun","၇ မိနစ်"],["8","はっぷん","hap-pun","၈ မိနစ်"],["9","きゅうふん","kyuu-fun","၉ မိနစ်"],["10","じゅっぷん","jup-pun","၁၀ မိနစ်"],["30","さんじゅっぷん・はん","sanjup-pun / han","30 minutes / half past · ၃၀ မိနစ် / တစ်နာရီခွဲ"],["?","なんぷん","nan-pun","how many minutes · ဘယ်နှစ် မိနစ်"]
];
var WEEKDAY_TABLE=[
 ["Sun","にちようび","nichi-youbi","Sunday · တနင်္ဂနွေ"],["Mon","げつようび","getsu-youbi","Monday · တနင်္လာ"],["Tue","かようび","ka-youbi","Tuesday · အင်္ဂါ"],["Wed","すいようび","sui-youbi","Wednesday · ဗုဒ္ဓဟူး"],["Thu","もくようび","moku-youbi","Thursday · ကြာသပတေး"],["Fri","きんようび","kin-youbi","Friday · သောကြာ"],["Sat","どようび","do-youbi","Saturday · စနေ"],["?","なんようび","nan-youbi","what day · ဘယ်နေ့"]
];
var MONTH_TABLE=[
 ["1","いちがつ","ichi-gatsu","January · ဇန်နဝါရီ"],["2","にがつ","ni-gatsu","February · ဖေဖော်ဝါရီ"],["3","さんがつ","san-gatsu","March · မတ်"],["4","しがつ","shi-gatsu","April · ဧပြီ"],["5","ごがつ","go-gatsu","May · မေ"],["6","ろくがつ","roku-gatsu","June · ဇွန်"],["7","しちがつ","shichi-gatsu","July · ဇူလိုင်"],["8","はちがつ","hachi-gatsu","August · ဩဂုတ်"],["9","くがつ","ku-gatsu","September · စက်တင်ဘာ"],["10","じゅうがつ","juu-gatsu","October · အောက်တိုဘာ"],["11","じゅういちがつ","juu-ichi-gatsu","November · နိုဝင်ဘာ"],["12","じゅうにがつ","juu-ni-gatsu","December · ဒီဇင်ဘာ"],["?","なんがつ","nan-gatsu","what month · ဘယ်လ"]
];
var DATE_TABLE=[
 ["1","ついたち","tsuitachi","၁ ရက်"],["2","ふつか","futsuka","၂ ရက်"],["3","みっか","mikka","၃ ရက်"],["4","よっか","yokka","၄ ရက်"],["5","いつか","itsuka","၅ ရက်"],["6","むいか","muika","၆ ရက်"],["7","なのか","nanoka","၇ ရက်"],["8","ようか","youka","၈ ရက်"],["9","ここのか","kokonoka","၉ ရက်"],["10","とおか","tooka","၁၀ ရက်"],
 ["11","じゅういちにち","juu-ichi-nichi","၁၁ ရက်"],["12","じゅうににち","juu-ni-nichi","၁၂ ရက်"],["13","じゅうさんにち","juu-san-nichi","၁၃ ရက်"],["14","じゅうよっか","juu-yokka","၁၄ ရက်"],["15","じゅうごにち","juu-go-nichi","၁၅ ရက်"],["16","じゅうろくにち","juu-roku-nichi","၁၆ ရက်"],["17","じゅうしちにち","juu-shichi-nichi","၁၇ ရက်"],["18","じゅうはちにち","juu-hachi-nichi","၁၈ ရက်"],["19","じゅうくにち","juu-ku-nichi","၁၉ ရက်"],["20","はつか","hatsuka","၂၀ ရက်"],
 ["21","にじゅういちにち","ni-juu-ichi-nichi","၂၁ ရက်"],["22","にじゅうににち","ni-juu-ni-nichi","၂၂ ရက်"],["23","にじゅうさんにち","ni-juu-san-nichi","၂၃ ရက်"],["24","にじゅうよっか","ni-juu-yokka","၂၄ ရက်"],["25","にじゅうごにち","ni-juu-go-nichi","၂၅ ရက်"],["26","にじゅうろくにち","ni-juu-roku-nichi","၂၆ ရက်"],["27","にじゅうしちにち","ni-juu-shichi-nichi","၂၇ ရက်"],["28","にじゅうはちにち","ni-juu-hachi-nichi","၂၈ ရက်"],["29","にじゅうくにち","ni-juu-ku-nichi","၂၉ ရက်"],["30","さんじゅうにち","san-juu-nichi","၃၀ ရက်"],["31","さんじゅういちにち","san-juu-ichi-nichi","၃၁ ရက်"],["?","なんにち","nan-nichi","what date · ဘယ်ရက်"]
];
/* Past / present / future — each row: label + 5 steps from past to future */
var REL_ROWS=[
 ["Day","နေ့",[["おととい","ototoi","day before yesterday","တမြန်နေ့"],["きのう","kinou","yesterday","မနေ့က"],["きょう","kyou","today","ဒီနေ့"],["あした","ashita","tomorrow","မနက်ဖြန်"],["あさって","asatte","day after tomorrow","သဘက်ခါ"]]],
 ["Morning","မနက်",[["おとといの あさ","ototoi no asa","morning of the day before yesterday","တမြန်နေ့ မနက်"],["きのうの あさ","kinou no asa","yesterday morning","မနေ့က မနက်"],["けさ","kesa","this morning","ဒီမနက်"],["あしたの あさ","ashita no asa","tomorrow morning","မနက်ဖြန် မနက်"],["あさっての あさ","asatte no asa","morning of the day after tomorrow","သဘက်ခါ မနက်"]]],
 ["Night","ည",[["おとといの ばん","ototoi no ban","night of the day before yesterday","တမြန်နေ့ ည"],["きのうの ばん","kinou no ban","last night","မနေ့ည"],["こんばん","konban","tonight","ဒီည"],["あしたの ばん","ashita no ban","tomorrow night","မနက်ဖြန် ည"],["あさっての ばん","asatte no ban","night of the day after tomorrow","သဘက်ခါ ည"]]],
 ["Week","အပတ်",[["せんせんしゅう","sensenshuu","the week before last","လွန်ခဲ့သော နှစ်ပတ်က"],["せんしゅう","senshuu","last week","ပြီးခဲ့တဲ့အပတ်"],["こんしゅう","konshuu","this week","ဒီအပတ်"],["らいしゅう","raishuu","next week","နောက်အပတ်"],["さらいしゅう","saraishuu","the week after next","နောက်အပတ်ရဲ့ နောက်အပတ်"]]],
 ["Month","လ",[["せんせんげつ","sensengetsu","the month before last","လွန်ခဲ့သော နှစ်လက"],["せんげつ","sengetsu","last month","ပြီးခဲ့တဲ့လ"],["こんげつ","kongetsu","this month","ဒီလ"],["らいげつ","raigetsu","next month","နောက်လ"],["さらいげつ","saraigetsu","the month after next","နောက်လရဲ့ နောက်လ"]]],
 ["Year","နှစ်",[["おととし","ototoshi","the year before last","တမြန်နှစ်"],["きょねん","kyonen","last year","ပြီးခဲ့တဲ့နှစ်"],["ことし","kotoshi","this year","ဒီနှစ်"],["らいねん","rainen","next year","နောက်နှစ်"],["さらいねん","sarainen","the year after next","နောက်နှစ်ရဲ့ နောက်နှစ်"]]]
];
var MAI_TABLE=[
 ["まいにち","mai-nichi","every day","နေ့တိုင်း"],["まいあさ","mai-asa","every morning","မနက်တိုင်း"],["まいばん","mai-ban","every night","ညတိုင်း"],["まいしゅう","mai-shuu","every week","အပတ်တိုင်း"],["まいつき","maitsuki","every month","လတိုင်း"],["まいとし","maitoshi","every year","နှစ်တိုင်း"],
 ["あさ","asa","morning","မနက်"],["ひる","hiru","daytime; noon","နေ့လည်"],["ばん・よる","ban / yoru","evening; night","ည"]
];