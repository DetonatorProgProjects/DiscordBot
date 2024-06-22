import { Command, Responder, ResponderType } from "#base";
import { icon } from "#functions";
import { createEmbed, createEmbedAuthor, createRow } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle, User } from "discord.js";

new Command({
    name: "cow-counter",
    description: "Cow counter command",
    type: ApplicationCommandType.ChatInput,
    run(interaction) {
        interaction.reply(counterMenu(interaction.user, 0));
    },
});

new Responder({
    customId: "counter/:action/:current",
    type: ResponderType.Button, cache: "cached",
    run(interaction, params) {
        const current = Number.parseInt(params.current);
        const updated = params.action === "add" ? current + 1 : current - 1;

        interaction.update(counterMenu(interaction.user, updated));
    },
});

function counterMenu(user: User, current: number){    
    const embed = createEmbed({
        author: createEmbedAuthor(user),
        color: "Random",
        description: `${icon("cowanimial")} Current cow value: ${current}`
    });
    const row = createRow(
        new ButtonBuilder({
            customId: `counter/add/${current}`, 
            label: "+1", 
            style: ButtonStyle.Success
        }),
        new ButtonBuilder({
            customId: `counter/remove/${current}`, 
            label: "-1", 
            style: ButtonStyle.Danger
        }),
    );
    return { embeds: [embed], components: [row] };
}

