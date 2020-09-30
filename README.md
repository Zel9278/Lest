# Discord.js command framework - Lest v2.2
このフレームワークはコマンド応答をちょっと強化したものになります。
<br>自己満足のために作ったので文句は受け付けないです。
<br>Lestという名前で再公開しました。

## 方法

```javascript
const config = {
  bot_config: {
    commands_path: "./commands.js",//コマンドファイルのパス
    prefix: "/",//プレフィックス
    admin: ["12345..."],//adminがついてるコマンドが使える人のID
    default: ["help", "reload"]//defaultコマンド、helpとreloadだけしか今はない
  }
};

const Lest   = require("./Lest.js")//このフレームワークのファイル
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
      admin: true,//adminコマンドの場合はここを追加
      func: () => {
        ...
      }
    },
    {
      name: "subcmd",
      description: "デバッグ",
      example: "subcmd help",
      subCommand: true,
      commands: {}//subcommand require("subcommand path")か{cmds: []}
    }
  ]
};

module.exports = commands;
```

## その他
<client>.lest: this.lest
