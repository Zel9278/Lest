class Lest {
  constructor(config) {
    var defaults = {
      commands: [
        {
          name: "help",
          description: "コマンド一覧",
          example: `help`,
          func: async ({message, args}) => {
            const help_data = arrayChunk(this.commands, 5);
            const tools = ["◀️", "▶️", "🔍", "🗑"];

            const rc = Math.floor(Math.random() * 16777214) + 1;
            const filter = (reaction, user) => {
              return tools.includes(reaction.emoji.name) && user.id === message.author.id;
            };
            let page = 0;
            let user = message.author;
          
            const helpMessage = await message.channel.send({
              embed: {
                title: "コマンド一覧",
                description: "**注意**: コマンドの一部は、管理権限を持っていないと実行されないコマンドがあります。",
                color: rc,
                footer: {
                  text: "ステータス: リアクション待機中…"
                },
                fields:[
                  {
                    name: `${tools[0]}`,
                    value: `1ページ戻ります`
                  },
                  {
                    name: `${tools[1]}`,
                    value: `1ページ進みます`
                  },
                  {
                    name: `${tools[2]}`,
                    value: `指定したページに飛びます`
                  },
                  {
                    name: `${tools[3]}`,
                    value: `メッセージを閉じます`
                  }
                ]
              }
            });
          
            for(let i = 0; i < tools.length; i++) {
              await helpMessage.react(tools[i]);
            }

            async function help() {
              await helpMessage.edit({
                embed: {
                  title: "コマンド一覧 " + (page + 1) + "P",
                  description: "**注意**: コマンドの一部は、管理権限を持っていないと実行されないコマンドがあります。\n" + `${help_data[page].map(help => {
                    var orAdmin = (help.admin) ? `[Admin] ${help.name}` : help.name;
                    return "**" + orAdmin + "**\n" + `${help.description} | ${help.example}`;
                }).join("\n")}`,
                  color: rc,
                  footer: {
                    text: "ステータス: 完了\n" + `${help_data.length}ページ中${page + 1}ページを表示しています。`
                  }
                }
              });
              
              helpMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] }).then(async collected => {
                const reaction = collected.first();
                switch(reaction.emoji.name) {
                  case tools[0]:
                    if(page != 0) {
                      page -= 1;
                    }
                    help();
                  break;
          
                  case tools[1]:
                    if(page != help_data.length - 1) {
                      page += 1;
                    }
                    help();
                  break;
                  
                  case tools[2]:
                    await helpMessage.edit({
                      embed: {
                        title: "コマンド一覧 " + (page + 1) + "P",
                        description: "**注意**: コマンドの一部は、管理権限を持っていないと実行されないコマンドがあります。\n" + `${help_data[page].map(help => {
                          var orAdmin = (help.admin) ? `[Admin] ${help.name}` : help.name;
                          return "**" + orAdmin + "**\n" + `${help.description} | ${help.example}`;
                      }).join("\n")}`,
                        color: rc,
                        footer: {
                          text: "ステータス: 入力待機中\n" + `${help_data.length}ページ中${page + 1}ページを表示しています。`
                        }
                      }
                    });

                    const filter = async (response) => {
                      return response.content.toLowerCase() && user.id === message.author.id;
                    };
          
                    message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] }).then(async collected => {
                      const res = collected.first();
                      if(parseInt(res.content, 10) >= 1 && parseInt(res.content, 10) <= help_data.length) {
                        page = parseInt(res.content, 10) - 1;
                      }
                      res.delete();
                      help();
                    }).catch(() => {
                      message.channel.send({
                        embed: {
                         title: "実行失敗",
                         description:  "タイムアウト",
                         color: Math.floor(Math.random() * 16777214) + 1
                        }
                      });
                      help();
                    });
                  break;
                    
                  case tools[3]:
                    await helpMessage.delete();
                  break;
                }
              }).catch(async colled => {
                message.channel.send({
                  embed: {
                   title: "実行失敗",
                   description:  "タイムアウト",
                   color: Math.floor(Math.random() * 16777214) + 1
                  }
                });
                await helpMessage.delete();
              });
            }
            help();
          }
        },
        {
          name: "reload",
          description: "commandをリロードします",
          example: "reload",
          admin: true,
          func: ({client, message}) => {
            this.commands = null;
            delete require.cache[require.resolve(this.config.bot_config.commands_path)];
            this.commands = require(this.config.bot_config.commands_path);
            if(this.config.bot_config.default) {
              this.config.bot_config.default.forEach((comName, index) => {
                if(!(defaults.commands.find(c => c.name === comName))) return;
                this.commands.unshift(defaults.commands.find(c => c.name === comName));
              });
              console.log(`${this.commands.length} loaded: ${this.commands.map(c => c.name).join(", ")}`);
            }
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
    this.config = config;
    this.commands = require(this.config.bot_config.commands_path);

    this.client.on("ready", () => {
      if(this.config.bot_config.default) {
        this.config.bot_config.default.forEach(comName => {
          if(!(defaults.commands.find(c => c.name === comName))) return;
          this.commands.unshift(defaults.commands.find(c => c.name === comName));
        });
      }
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
  
    if(this.commands.some(c => c.name === command)) {
      const com = this.commands.find(c => c.name === command);
      if(com.admin) {
        if(!this.config.bot_config.admin.some(ad => ad === message.author.id)) return message.reply("管理者コマンドを使う権限がありません。");
        com.func({client, message, args});
      } else {
        com.func({client, message, args});
      }
    }
  }

  login(token) {
    this.client.login(token);
  }
}

module.exports = Lest;

function arrayChunk([...array], size) {
  return array.reduce((acc, value, index) => index % size ? acc : [...acc, array.slice(index, index + size)], []);
}