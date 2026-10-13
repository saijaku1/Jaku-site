// キャラクターごとの画像・セリフ
const characters = [
  {
    name: "Jaku",
    image: "/characters/Jaku.svg",
    lines: [
      "よお。茶番はもう読んだかい？",
      "そこの君、僕の代わりにバイトを代行してくれないか？",
      "ねね。このサイト、どう思う？",
      "学校さぼりたいよぉ...",
      "このサイトはAstroっていうフレームワークで作られてるんだよ。",
      "タイピングが楽しすぎる！",
      "ちなみにココツとはもう3年ぐらいの付き合いなんだよね。",
      "ココツのことを知ってるのって多分僕が一番だと思うんだよね。だって僕のことを知ってるのはココツだけだし。(?)",
      "こういう些細な会話が楽しいんだよねぇ",
      "もしもこの世にアニメがなかったら....多分僕は生まれてなかった",
      "エルプサイ....コングルゥ....",
      "プログラミング....プログラミング....プログラミング....",
      "ちなみに僕はここ以外でもいろんなところで活動してるよ～",
    ],
  },
  {
    name: "ココツ",
    image: "/characters/kokotu.svg",
    lines: [
      "じゃくくんはおもろいよ。",
      "お、来てくれてありがとうねー",
      "勉強って本当に大変だよね。マジでわかる",
      "プログラミングと山登りって実は似てるんだよね。どっちも大変だけど、登りきったときの達成感が最高なんだよね。",
      "やっぱりホラーゲームは楽しいね。ジャンプスケアが最高だよね。",
      "僕は学生じゃないよ！かと言って犬じゃないからね！？",
      "最近、じゃくくんが梨をもらったらしくて一緒に食べてるんだ",
      "実はこのサイトもちょっと僕も手伝ってるんだよね。まぁって言ってもJSの部分だけだけどね。",
    ],
  },
  {
    name: "ウサ",
    image: "/characters/usa.svg",
    lines: [
      "よろしくです！！",
      "今日も頑張るです！",
      "ふふふ……今日は私の出番です！",
      "じゃくは今なにやってるんでしょうね...",
      "これでもTypeScriptできるんですからね！？",
      "我が名はウサ！ウサギ族随一のプログラマーとして、TypeScriptの世界を書き開くもの！！！...あ、セリフ間違えちゃいました...",
      "本当にじゃくってひねくれてますよね...だけど私はそんなじゃくを尊敬してますけどね！",
      "そういえば最近アニメハマりました！！『この素晴らしい世界に祝福を！』ってやつめっちゃ面白いですね！",
      "なんだか最近じゃくが『エルプサイ・コングルゥ』って言ってるんですけど、あれってなんですか？",
    ],
  },
  {
    name: "うｐ主",
    image: "/characters/upunushi.svg",
    lines: [
      "気軽に話しかけてね...",
      "このサイトを作っているのはじゃくでアップロードをしたのが僕だよ",
      "僕はじゃくとココツたちの茶番を見守るだけの存在だよ",
      "はぁ...更新めんどくせぇ",
      "人生って山あり谷ありだよね",
      "Githubが誕生してなかったらどうなってたんだろうね...",
      "嫌いな人と関わるのって本当に大変だよね。僕は嫌いな人と関わるのが苦手だから、なるべく関わらないようにしてるんだよね。",
      "たまにじゃくって頭おかしくなることがあるけど、その時は無視して大丈夫だからね",
    ],
  },
  {
    name: "ミエ",
    image: "/characters/mie.svg",
    lines: [
      "やっほーー！！！！",
      "最近じゃくが変なことしてるって聞いたんだけどそれって本当！？",
      "ココツもウサもお姉ちゃんもみんな優しいなぁ～♪",
      "ぷろぐらみんぐってなぁに？",
      "ウサってウサギなんだね！？",
      "うｐ主はちょっと怖い...",
      "眠いよぉ.....",
    ],
  },
  {
    name: "葵",
    image: "/characters/aoi.svg",
    lines: [
      "やっほ～",
      "実は私...じゃくに勝手に召喚されたんだよね...",
      "そういえばじゃくたちが話しているプログラミングって何なの？",
      "私もプログラミングを勉強してみようかな～",
      "実はこの羽さ、別に飛べるわけでもないのにさ。なんでついてるんだろうね",
      "最近じゃくが机叩いてる回数が多くて本当にうるさいんだけどさ、どうしたらいいんだろう...",
    ],
  },
];

const positions = [
  "position-right-bottom",
  "position-left-bottom",
  "position-right-top",
  "position-left-top",
];

const widget = document.querySelector(".character-widget");
const avatar = document.querySelector(".character-avatar");
const message = document.querySelector(".character-message");

if (widget && avatar && message) {
  // 登場キャラクターをランダムに選ぶ
  const character = characters[Math.floor(Math.random() * characters.length)];

  // そのキャラクターのセリフをランダムに選ぶ
  const line =
    character.lines[Math.floor(Math.random() * character.lines.length)];

  // 配置をランダムに選ぶ
  const position = positions[Math.floor(Math.random() * positions.length)];

  avatar.src = character.image;
  avatar.alt = character.name;
  message.textContent = line;

  widget.classList.add(position);
}
