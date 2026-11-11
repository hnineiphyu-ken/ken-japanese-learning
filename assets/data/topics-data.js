var MINNA_META=[
 {l:1,jp:"じこしょうかい",t:"Lesson 1",d:"Introductions — I, you, teacher, countries"},
 {l:2,jp:"これ・それ・あれ",t:"Lesson 2",d:"This / that — things, gifts, languages"},
 {l:3,jp:"ここ・そこ・あそこ",t:"Lesson 3",d:"Places — here, there, floors, prices"},
 {l:4,jp:"じかん",t:"Lesson 4",d:"Time — o'clock, days of the week, daily routine"},
 {l:5,jp:"ひづけ・のりもの",t:"Lesson 5",d:"Dates & travel — months, days of the month, transport"},
 {l:6,jp:"たべます・のみます",t:"Lesson 6",d:"Daily actions — eat, drink, read, write, buy, meet"},
 {l:7,jp:"あげます・もらいます",t:"Lesson 7",d:"Giving & receiving — give, lend, teach, tools & cutlery"},
 {l:8,jp:"けいようし",t:"Lesson 8",d:"Adjectives — handsome, quiet, famous, big, small, new, old"},
 {l:9,jp:"すき・じょうず",t:"Lesson 9",d:"Likes & skills — like, good at, sports, music, travel"},
 {l:10,jp:"あります・います",t:"Lesson 10",d:"There is / there are — people, animals, things, places"},
 {l:11,jp:"かぞえかた",t:"Lesson 11",d:"Counters & quantity — counting things, people, time taken"},
 {l:12,jp:"ひかく",t:"Lesson 12",d:"Comparisons — easy, near, far, fast, sweet, spicy"},
 {l:13,jp:"ほしい",t:"Lesson 13",d:"Wants — play, swim, shopping, things I want"},
 {l:14,jp:"あけます・しめます",t:"Lesson 14",d:"Actions — turn on / off, open, close, wait, help"},
 {l:15,jp:"しごと",t:"Lesson 15",d:"Work & study — make, sell, know, live, documents, products"},
 {l:16,jp:"まいにち",t:"Lesson 16",d:"Daily routine — get on / off, shower, enter, begin"},
 {l:17,jp:"おぼえます・わすれます",t:"Lesson 17",d:"Errands & health — remember, forget, pay, medicine, bath"},
 {l:18,jp:"できます・しゅみ",t:"Lesson 18",d:"Can do & hobbies — piano, drive, reserve, diary"},
 {l:19,jp:"のぼります・なります",t:"Lesson 19",d:"Experiences — climb, stay overnight, clean, become"},
 {l:20,jp:"ふつうけい",t:"Lesson 20",d:"Plain style — need, look up, repair, kimono, visa"},
 {l:21,jp:"おもいます",t:"Lesson 21",d:"Opinions — think, say, win, lose, festivals"},
 {l:22,jp:"きます・はきます",t:"Lesson 22",d:"Clothes — put on, wear, coat, sweater, suit, glasses"},
 {l:23,jp:"みち",t:"Lesson 23",d:"Directions — ask, turn, cross, walk, sounds & sizes"},
 {l:24,jp:"てつだいます",t:"Lesson 24",d:"Helping out — introduce, guide, explain, moving, homestay"},
 {l:25,jp:"もし・たら",t:"Lesson 25",d:"If / when — study abroad, chance, job transfer, free time"}
];
var TOPICS=[
 {cat:"Numbers",jp:"かず",d:"1 to 10,000 — plus counters in Kotoba focus"},
 {cat:"Time Words",jp:"じかん",d:"Now, today, clock time, weeks, months, years"},
 {cat:"Greetings and Expressions",jp:"あいさつ",d:"Hello, thanks, excuse me, everyday phrases"},
 {cat:"People",jp:"ひと",d:"I, you, teacher, student, doctor"},
 {cat:"Family",jp:"かぞく",d:"Father, mother, siblings, grandparents"},
 {cat:"Food and Drink",jp:"たべもの",d:"Rice, fish, tea, fruit, sushi"},
 {cat:"Places and Locations",jp:"ばしょ",d:"School, station, bank, home, park"},
 {cat:"Verbs Group 1",jp:"どうし 1",d:"Go, buy, write, drink, speak…"},
 {cat:"Verbs Group 2",jp:"どうし 2",d:"Eat, see, wake up, open, forget…"},
 {cat:"い-Adjectives",jp:"けいようし",d:"Big, new, hot, delicious, busy…"}
];
function lessonBlock(noLabel,titleHtml,desc,count,words,onPractice){
  var div=document.createElement("div"); div.className="lesson";
  div.innerHTML=
    '<div class="lesson-head"><span class="lesson-no">'+noLabel+'</span>'+
    '<div class="lesson-title"><span class="t">'+titleHtml+'</span><span class="d">'+escapeHtml(desc)+'</span></div>'+
    '<span class="lesson-count">'+count+' words</span></div>'+
    '<div class="lesson-actions"><button class="lesson-btn study-btn">Study words</button>'+
    '<button class="lesson-btn primary practice-btn">Practice quiz →</button></div>'+
    '<div class="lesson-words"><ul class="word-list"></ul><div class="pager lesson-pager"></div></div>';
  var wordsEl=div.querySelector(".lesson-words");
  var listEl=div.querySelector(".lesson-words .word-list");
  var pagerEl=div.querySelector(".lesson-pager");
  var lpage=1, LPS=20;
  function drawLessonPage(){
    var pages=Math.max(1,Math.ceil(words.length/LPS));
    if(lpage>pages)lpage=pages;
    var s=(lpage-1)*LPS;
    listEl.innerHTML=words.slice(s,s+LPS).map(function(w,i){return wordRowHtml(w,false,s+i+1);}).join("");
    renderPager(pagerEl,pages,lpage,function(p){lpage=p;drawLessonPage();});
  }
  drawLessonPage();
  var studyBtn=div.querySelector(".study-btn");
  studyBtn.addEventListener("click",function(){
    var willOpen=!wordsEl.classList.contains("open");
    document.querySelectorAll(".lesson-words").forEach(function(x){x.classList.remove("open");});
    document.querySelectorAll(".study-btn").forEach(function(x){x.textContent="Study words";});
    if(willOpen){wordsEl.classList.add("open");studyBtn.textContent="Hide words";}
  });
  div.querySelector(".practice-btn").addEventListener("click",onPractice);
  return div;
}
function renderLessons(){
  var ml=$("minnaList"); ml.innerHTML="";
  MINNA_META.forEach(function(M){
    var words=MINNA.filter(function(w){return w.l===M.l;});
    ml.appendChild(lessonBlock("Lesson "+M.l,'<span class="jp">'+M.jp+'</span> · '+M.t,M.d,words.length,words,function(){startLessonQuiz("MINNA:"+M.l);}));
  });
  var tl=$("topicList"); tl.innerHTML="";
  TOPICS.forEach(function(T,i){
    var words=WORDS.filter(function(w){return w.cat===T.cat;});
    if(!words.length)return;
    tl.appendChild(lessonBlock("Topic "+(i+1),'<span class="jp">'+T.jp+'</span> · '+T.cat,T.d,words.length,words,function(){startLessonQuiz(T.cat);}));
  });
  $("lessonCount").textContent="Minna Lessons 1–25 · "+MINNA.length+" words · N5 topics from the "+WORDS.length+"-word list";
}
renderLessons();

/* ============ BASICS (own tab — kept out of the Kotoba list) ============ */
var BASIC_COUNT=[
 ["0","ゼロ・れい","zero / rei","zero","သုည"],["1","いち","ichi","one","တစ်"],["2","に","ni","two","နှစ်"],["3","さん","san","three","သုံး"],["4","よん・し","yon / shi","four","လေး"],["5","ご","go","five","ငါး"],["6","ろく","roku","six","ခြောက်"],["7","なな・しち","nana / shichi","seven","ခုနှစ်"],["8","はち","hachi","eight","ရှစ်"],["9","きゅう・く","kyuu / ku","nine","ကိုး"],["10","じゅう","juu","ten","ဆယ်"],
 ["11","じゅういち","juu-ichi","eleven","ဆယ့်တစ်"],["12","じゅうに","juu-ni","twelve","ဆယ့်နှစ်"],["13","じゅうさん","juu-san","thirteen","ဆယ့်သုံး"],["14","じゅうよん","juu-yon","fourteen","ဆယ့်လေး"],["15","じゅうご","juu-go","fifteen","ဆယ့်ငါး"],["16","じゅうろく","juu-roku","sixteen","ဆယ့်ခြောက်"],["17","じゅうなな","juu-nana","seventeen","ဆယ့်ခုနှစ်"],["18","じゅうはち","juu-hachi","eighteen","ဆယ့်ရှစ်"],["19","じゅうきゅう","juu-kyuu","nineteen","ဆယ့်ကိုး"],["20","にじゅう","ni-juu","twenty","နှစ်ဆယ်"],
 ["30","さんじゅう","san-juu","thirty","သုံးဆယ်"],["40","よんじゅう","yon-juu","forty","လေးဆယ်"],["50","ごじゅう","go-juu","fifty","ငါးဆယ်"],["60","ろくじゅう","roku-juu","sixty","ခြောက်ဆယ်"],["70","ななじゅう","nana-juu","seventy","ခုနှစ်ဆယ်"],["80","はちじゅう","hachi-juu","eighty","ရှစ်ဆယ်"],["90","きゅうじゅう","kyuu-juu","ninety","ကိုးဆယ်"],
 ["100","ひゃく","hyaku","one hundred","တစ်ရာ"],["1,000","せん","sen","one thousand","တစ်ထောင်"],["10,000","いちまん","ichi-man","ten thousand","တစ်သောင်း"]
];
var GREETINGS=[
 {jp:"おはようございます",rom:"ohayou gozaimasu",en:"good morning",my:"မင်္ဂလာနံနက်ခင်းပါ",when:"မနက်ပိုင်း · ယဉ်ကျေးသော အသုံး"},
 {jp:"おはよう",rom:"ohayou",en:"good morning (casual)",my:"မင်္ဂလာပါ (မနက်)",when:"မနက်ပိုင်း · ရင်းနှီးသူများနှင့် အရပ်သုံး"},
 {jp:"こんにちは",rom:"konnichiwa",en:"hello; good afternoon",my:"မင်္ဂလာပါ",when:"နေ့လည်ပိုင်း"},
 {jp:"こんばんは",rom:"konbanwa",en:"good evening",my:"မင်္ဂလာညနေခင်းပါ",when:"ညနေပိုင်း"},
 {jp:"おやすみなさい",rom:"oyasuminasai",en:"good night",my:"ကောင်းသောညပါ",when:"ညအိပ်ခင် နှုတ်ဆက်ချိန်"},
 {jp:"さようなら",rom:"sayounara",en:"goodbye",my:"နှုတ်ဆက်ပါတယ်",when:"အချိန်ကြာ မတွေ့တော့မည့်အခါ နှုတ်ဆက်ချိန်"},
 {jp:"じゃあね",rom:"jaa ne",en:"see you (casual)",my:"နောက်မှတွေ့မယ်",when:"ရင်းနှီးသူများနှင့် နှုတ်ဆက်ချိန်"},
 {jp:"またあした",rom:"mata ashita",en:"see you tomorrow",my:"မနက်ဖြန်တွေ့မယ်",when:"မနက်ဖြန် ပြန်တွေ့မည့်အခါ"},
 {jp:"ありがとうございます",rom:"arigatou gozaimasu",en:"thank you (polite)",my:"ကျေးဇူးတင်ပါတယ်",when:"ယဉ်ကျေးသော ကျေးဇူးတင်ချိန်"},
 {jp:"ありがとう",rom:"arigatou",en:"thanks (casual)",my:"ကျေးဇူးပါ",when:"ရင်းနှီးသူများနှင့် အရပ်သုံး"},
 {jp:"どういたしまして",rom:"dou itashimashite",en:"you're welcome",my:"ရပါတယ်",when:"ကျေးဇူးတင်ခံရသည့်အခါ ပြန်ဖြေချိန်"},
 {jp:"すみません",rom:"sumimasen",en:"excuse me; I'm sorry",my:"တောင်းပန်ပါတယ် / ခွင့်လွှတ်ပါ",when:"တစ်စုံတစ်ယောက်ကို ခေါ်ချိန်၊ လမ်းမေးချိန်၊ တောင်းပန်ချိန်"},
 {jp:"ごめんなさい",rom:"gomennasai",en:"I'm sorry",my:"တောင်းပန်ပါတယ်",when:"အမှားလုပ်မိသည့်အခါ တောင်းပန်ချိန်"},
 {jp:"はじめまして",rom:"hajimemashite",en:"nice to meet you",my:"တွေ့ရတာဝမ်းသာပါတယ်",when:"ပထမဆုံး စတင် မိတ်ဆက်ချိန်"},
 {jp:"よろしくおねがいします",rom:"yoroshiku onegaishimasu",en:"please be kind to me; I look forward to working with you",my:"တွေ့ရတာဝမ်းသာပါတယ် / ကျေးဇူးပြု၍ ကူညီပေးပါ",when:"မိတ်ဆက်ပြီးနောက် ပြောချိန်"},
 {jp:"おげんきですか",rom:"ogenki desu ka",en:"how are you?",my:"နေကောင်းလား",when:"အခြေအနေ မေးမြန်းချိန်"},
 {jp:"いただきます",rom:"itadakimasu",en:"(said before eating)",my:"စားပါတော့မယ်",when:"အစာ မစားခင်"},
 {jp:"ごちそうさまでした",rom:"gochisousama deshita",en:"thank you for the meal",my:"ကျေးဇူးတင်ပါတယ် (စားပြီးနောက်)",when:"အစာ စားပြီးနောက်"},
 {jp:"ただいま",rom:"tadaima",en:"I'm home",my:"ပြန်ရောက်ပါပြီ",when:"အိမ် ပြန်ရောက်သည့်အခါ"},
 {jp:"おかえりなさい",rom:"okaerinasai",en:"welcome home",my:"ပြန်ရောက်တာ ကြိုဆိုပါတယ်",when:"အိမ်ကလူ ပြန်ရောက်သည့်အခါ ပြန်ဖြေချိန်"}
];
var BPS=20;
(function(){
  var gpage=1;
  function drawGreet(){
    var pages=Math.max(1,Math.ceil(GREETINGS.length/BPS));
    if(gpage>pages)gpage=pages;
    var s=(gpage-1)*BPS;
    $("greetTable").innerHTML=GREETINGS.slice(s,s+BPS).map(function(g,i){
      return '<div class="rt-row"><span class="rt-n">'+(s+i+1)+'.</span><span class="rt-j">'+escapeHtml(g.jp)+'</span><span class="rt-r">'+escapeHtml(g.rom)+'</span><span class="rt-m">'+escapeHtml(g.en)+' · '+escapeHtml(g.my)+'<br><span style="color:var(--faint)">သုံးသည့်အချိန် — '+escapeHtml(g.when)+'</span></span></div>';
    }).join("");
    renderPager($("greetPager"),pages,gpage,function(p){gpage=p;drawGreet();});
  }
  drawGreet();
})();

/* Basics quiz — Numbers + Counters + Greetings + Minna 1–25, inside the Basics tab.
   Pool: BASIC_COUNT (the 0–10,000 counting subset) + every COUNTERS row
   + GREETINGS. */
var BASICS_POOL=BASIC_COUNT.map(function(r){return {jp:r[1],rom:r[2],en:r[3],my:r[4]};})
  .concat(COUNTERS.reduce(function(acc,c){
    return acc.concat(c.rows.map(function(r){return {jp:r[1],rom:r[2],en:r[3],my:r[4]};}));
  },[]))
  .concat(GREETINGS.map(function(g){return {jp:g.jp,rom:g.rom,en:g.en,my:g.my};}));
/* Minna Lessons 1–25 words join the Basics quiz pool too — deduped by
   jp + romaji against everything already in the pool. */
(function(){
  var seen={};
  BASICS_POOL.forEach(function(w){seen[w.jp+"\u0001"+w.rom]=1;});
  MINNA.forEach(function(w){
    var k=w.jp+"\u0001"+w.rom;
    if(seen[k])return; seen[k]=1;
    BASICS_POOL.push({jp:w.jp,rom:w.rom,en:w.en,my:w.my});
  });
})();
var bq=null;