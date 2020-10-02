# Discord.js command framework - Lest v2.2
このフレームワークはコマンド応答をちょっと強化したものになります。
<br>自己満足のために作ったので文句は受け付けないです。
<br>Lestという名前で再公開しました。

## インストール
`npm install git+https://github.com/Zel9278/Lest.git`

## 方法

```javascript
const config = {
  bot_config: {
    commands: require("./commands.js"),//command require("command path")か{cmds: []}
    prefix: "/",//プレフィックス
    admin: ["12345..."],//adminがついてるコマンドが使える人のID
    default: ["help"]//defaultコマンド、今はhelpだけしか今はない
  }
};

const Lest   = require("@Zel9278/lest")
    , cf     = new Lest(config)
    //, discord = cf.discord
    , client = cf.client;

client.login("your bottoken here");
```

# commands, subcommands
コマンドを書くときに使うやつです。
```javascript
const commands = {
  cmds: [
    {
      name: "echo",//コマンドの名前
      description: "こだま返し",//コマンドの説明
      example: ".echo <text>",//コマンドの使用例
      category: "玩具",//コマンドのカテゴリー
      func: ({message, args}) => {
        message.channel.send({
          embed: {
            title: message.author.tag,
            description: args.join(" ")
          }
        });
      }//コマンドの機能
    },
    {
      name: "test",
      description: "デバッグ",
      example: ".test",
      category: "デベロッパーツール",//カテゴリーはアドミンに固定されます
      admin: true,//adminコマンドの場合はここを追加
      func: () => {
        ...
      }
    },
    {
      name: "subcmd",
      description: "デバッグ",
      example: "subcmd help",
      subCommand: true,//カテゴリーはサブコマンドに固定されます。
      commands: {}//subcommand require("subcommand path")か{cmds: []}
    }
  ]
};

module.exports = commands;
```

## その他
`<client>.lest: this.lest`

## 注意
```
message.client.lest.config //メッセージの応答のとき別のやつがある場合configはここから参照しないといけない
```
