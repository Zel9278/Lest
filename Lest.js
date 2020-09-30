class Lest {
  constructor(config) {
    var defaults = {
      commands: [
        {
          name: "reload",
          description: "commandをリロードします",
          example: "reload",
          admin: true,
          category: "デベロッパーツール",
          func: ({client, message}) => {
            this.commands = null;
            delete require.cache[require.resolve(this.config.bot_config.commands_path)];
            this.commands = require(this.config.bot_config.commands_path);
            this.commands.categories = {
              list: [],
              splitData: []
            };
            this.commands.subCommands = [];

            if(this.config.bot_config.default) {
              this.config.bot_config.default.forEach((comName, index) => {
                if(!(defaults.commands.find(c => c.name === comName))) return;
                this.commands.cmds.unshift(defaults.commands.find(c => c.name === comName));
              });
              console.log(`${this.commands.cmds.length} loaded: ${this.commands.cmds.map(c => c.name).join(", ")}`);
            }
            this.commands.cmds.forEach(i => {
              if(i.subCommand) {
                this.commands.cmds = this.commands.cmds.filter(n => n !== i);
                this.commands.subCommands.push(i);
                this.commands.categories.splitData["サブコマンド"] = [];
                this.commands.categories.splitData["サブコマンド"].push(i);
              }
              if(i.func == null) return this.commands.cmds = this.commands.cmds.filter(n => n !== i);
              var cat = i["category"];
              var isUnspecified = (cat == undefined || cat == null || cat == "") ? "unspecified" : cat;
              if(typeof this.commands.categories.splitData[isUnspecified] == "undefined") this.commands.categories.splitData[isUnspecified] = [];
              this.commands.categories.splitData[isUnspecified].push(i);
            });
            this.commands.categories.list = Object.keys(this.commands.categories.splitData);
          }
        }
      ],
      config: {
        bot_config: {
          commands_path: "./commands.js",
          prefix: "/",
          admin: [],
          default: []
        }
      }
    };

    if(!config) throw Error("configがありません。");
    this.discord = require("discord.js");
    this.client = new this.discord.Client();
    this.client.lest = {};
    this.config = config;
    this.commands = require(this.config.bot_config.commands_path);

    this.client.on("ready", async () => {
      if(this.config.bot_config.default) {
        this.config.bot_config.default.forEach(comName => {
          if(!(defaults.commands.some(c => c.name === comName))) return;
          this.commands.cmds.push(defaults.commands.find(c => c.name === comName));
        });
      }
      
      this.initCommands(this.commands);

      this.client.lest = this;
    });

    this.client.on("message", message => {
      this.cmnd(this.client, message);
    });
  }
  
  cmnd(client, message) {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(message.content.indexOf(this.config.bot_config.prefix) !== 0) return;
  
    const args = message.content.slice(this.config.bot_config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(this.commands.subCommands.some(c => c.name === command)) return this.subcmd(args, message, this.commands.subCommands.find(c => c.name === command));
    if(this.commands.cmds.some(c => c.name === command)) {
      const com = this.commands.cmds.find(c => c.name === command);
      if(com.admin) {
        if(!this.config.bot_config.admin.some(ad => ad === message.author.id)) return message.reply("管理者コマンドを使う権限がありません。");
        com.func({client, message, args});
      } else {
        com.func({client, message, args});
      }
    }
  }

  subcmd(args, message, c) {
    const arg = args.join(" ").split(/ +/g);
    const command = arg.shift().toLowerCase();
    const com = c.commands.cmds.find(_c => _c.name === command);

    if(c.commands.subCommands.some(_c => _c.name === command)) return this.subcmd(arg, message, c.commands.subCommands.find(_c => _c.name === command));
    if(c.commands.cmds.some(_c => _c.name === command)) {
      if(com.admin) {
        if(!this.config.bot_config.admin.some(ad => ad === message.author.id)) return message.reply("管理者コマンドを使う権限がありません。");
        com.func({client: this.client, message, args: arg});
      } else {
        com.func({client: this.client, message, args: arg});
      }
    } else {
      var isHelp = (this.config.bot_config.default.some(d => d === "help")) ?
      "**helpコマンドを打つと、コマンドの一覧が表示されます。**" :
      "デフォルトにhelpがありません。";

      message.channel.send({
        embed: {
          title: `サブコマンド - ${c.name}`,
          description: `${isHelp}\nこのコマンドには現在${c.commands.cmds.length}個のコマンドがあります。`
        }
      });
    }
  }

  initCommands(commands) {
    commands.categories = {
      list: [],
      splitData: []
    };
    commands.subCommands = [];

    if(this.config.bot_config.default.some(d => d === "help")) commands.cmds.unshift(this.makeHelp(commands));

    commands.cmds.forEach(i => {
      if(i.subCommand) {
        commands.cmds = commands.cmds.filter(n => n !== i);
        commands.subCommands.push(i);
        commands.categories.splitData["サブコマンド"] = [];
        commands.categories.splitData["サブコマンド"].push(i);
        i.commands.categories = {
          list: [],
          splitData: []
        };
        i.commands.subCommands = [];
        this.initCommands(i.commands);
      }

      if(i.func == null) return commands.cmds = commands.cmds.filter(n => n !== i);
      var cat = i["category"];
      var isUnspecified = (cat == undefined || cat == null || cat == "") ? "未指定" : cat;
      if(typeof commands.categories.splitData[isUnspecified] == "undefined") commands.categories.splitData[isUnspecified] = [];
      commands.categories.splitData[isUnspecified].push(i);
    });
    commands.categories.list = Object.keys(commands.categories.splitData);
  }

  makeHelp(commands) {
    return {
      name: "help",
      description: "コマンドリスト",
      example: "help <コマンド>",
      category: "道具",
      func: ({message, args}) => {
        commands.cmds.sort();
        const [tx] = args;
        var viewData = commands.categories.list.map(i => { return { name: i, value: commands.categories.splitData[i].map(a => { return "`" + a.name + "`" }).join(", ") }; });

        if(tx == null) {
          message.channel.send({
            embed: {
              title: "help",
              description: '”help <コマンド>”で詳しい情報が閲覧できます。\n',
              color: parseInt("#0000ff".replace(/#/, ""), 16),
              fields: viewData
            }
          });
        } else {
          var isSubCmd_if = (commands.subCommands.some(c => c.name === tx)) ?
          !(commands.subCommands.some(c => c.name === tx)) :
          !(commands.cmds.some(c => c.name === tx));
          if(isSubCmd_if) return `コマンドがありません: ${tx}`;
          var isSubCmd_find = (commands.subCommands.some(c => c.name === tx)) ?
          commands.subCommands.find(c => c.name === tx) :
          commands.cmds.find(c => c.name === tx);
          var com = isSubCmd_find;
          var orAdmin = (com.admin) ? `[Admin] ${com.name}` : com.name;
          var isUnspecified = (com.category == undefined || com.category == null || com.category == "") ? "unspecified" : com.category;
          var isSubCmd = (com.subCommand) ? isUnspecified = "サブコマンド" : isUnspecified;
          message.channel.send({
            embed: {
              title: orAdmin,
              description: `***${com.description}***\n使用方法: ${com.example}\nカテゴリー: ${isSubCmd}`,
              color: parseInt("#0000ff".replace(/#/, ""), 16)
            }
          });
        }
      }
    };
  }

  login(token) {
    this.client.login(token);
  }
}

module.exports = Lest;