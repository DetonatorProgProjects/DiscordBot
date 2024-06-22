import { Command } from "#base";
import {  ApplicationCommandType, ApplicationCommandOptionType, AttachmentBuilder } from "discord.js";

new Command({
  name: "emojis",
  description: "get emojis",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "server",
      description: "get server emojis",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "bot",
      description: "get bot emojis",
      type: ApplicationCommandOptionType.Subcommand,
    }
  ],
  async run(interaction){
    const { options, client, guild } = interaction;
    
    const subcommand = options.getSubcommand(true);
    
    interface Emojis {
      static: Record<string, string>;
      animated: Record<string, string>;
    }
    const emojis: Emojis = { static: {}, animated: {} };
    
    switch(subcommand){
      case "bot":
      case "server":{
        const emojisCache = subcommand === "bot"
        ? client.emojis.cache
        : guild.emojis.cache;
        
        
        for(const { name, id, animated} of emojisCache.values()){
          if (!name) continue;
          emojis[animated ? "animated":"static"][name] = id;
        }
        
        const buffer = Buffer.from(JSON.stringify(emojis, null, 2), "utf-8");
        const attachment = new AttachmentBuilder(buffer, { name: "emojis.json"});
        
        interaction.reply({
          files: [attachment],
          content: `Emojis from ${subcommand}`
        })
      }
    }

  }

});