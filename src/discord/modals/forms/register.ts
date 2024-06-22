import { Responder, ResponderType } from "#base";
import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createModalInput, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, ModalBuilder, TextInputStyle, inlineCode } from "discord.js";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(4, "The name must have at least 4 letters."),
    email: z.string().email("YoYou entered an invalid email."),
    age: z.coerce.number({ invalid_type_error: "Age should be a number" }).min(1, "Invalid age entered.")

});

type FormSchema = z.infer<typeof formSchema>;

export function registerModal(data: Partial<Record<keyof FormSchema, string>> = {}){
    return new ModalBuilder({
        customId: "form/register",
        title: "RRegistration Form",
        components: [
            createModalInput({
                customId: "name",
                label: "name",
                placeholder: "Digit your name",
                style: TextInputStyle.Short,
                value: data.name,
                required,
            }),
            createModalInput({
                customId: "email",
                label: "email",
                placeholder: "Digit your email",
                style: TextInputStyle.Short,
                value: data.email,
                required,
            }),
            createModalInput({
                customId: "age",
                label: "age",
                placeholder: "Digit your age",
                style: TextInputStyle.Short,
                value: data.age,
                required,
            }),
        ]
    });
}

new Responder({
    customId: "form/register/:[data]",
    type: ResponderType.Button, cache: "cached",
    async run(interaction, { data }) {
        const [name, email, age] = data;
        interaction.showModal(registerModal({ name, email, age }));
    },
});

new Responder({
    customId: "form/register",
    type: ResponderType.Modal, cache: "cached",
    async run(interaction) {
        const { fields } = interaction;
        
        const rawData = fields.fields.reduce(
            (prev, curr) => ({ ...prev, [curr.customId]: curr.value }), {}

        );
        const parsedResult = formSchema.safeParse(rawData);
        if(!parsedResult.success){
            const embed = createEmbed({
                color: settings.colors.danger,
                description: brBuilder(
                `${icon("close")} The form has errors`,
                parsedResult.error.errors.map(err => `${inlineCode(err.message)}`)
                )
            });

            const row = createRow(
                new ButtonBuilder({
                customId: `form/register/${Object.values(rawData).join(",")}`,
                label: "Try again",
                style: ButtonStyle.Primary,
                emoji: icon("next")
                })
            );

            const options = { ephemeral, embeds: [embed], components: [row] };
             if (interaction.isFromMessage()){
                interaction.update(options);
                return;
            }
            interaction.reply(options);

             return;
        }

        const options = { ephemeral, content: "Form Sent", embeds: [], components: [] };
        
        console.log(parsedResult.data);
        
        if (interaction.isFromMessage()){
            interaction.update(options);
            return;
        }
        interaction.reply(options);
    },
});

