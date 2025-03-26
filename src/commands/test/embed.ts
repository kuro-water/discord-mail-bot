import {SlashCommand} from "../../@types/types";
import {AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import * as path from "node:path";

export const embed: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("埋め込みメッセージのテストだよ"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const filePath = path.join(__dirname, "../../images/icon.jpg");
        const icon = new AttachmentBuilder(filePath);

        const embed = new EmbedBuilder()
            // .setColor(0x0099FF)
            .setURL("https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox")
            // .setAuthor({
            //     name: "notify email made by kuro-water",
            //     iconURL: "attachment://icon.jpg",
            //     url: "https://github.com/kuro-water/discord-mail-bot"
            // })
            .setTitle("To:example.com")
            // .setDescription("from:example.com")
            .setAuthor({name: "from:example.com"})
            // .setThumbnail("https://i.imgur.com/AfFp7pu.png")
            .addFields(
                {
                    name: "[Test] This is Subject",
                    value: "This is main text\n" +
                        "hello, discord\n" +
                        "hello, discord\n" +
                        "hello, discord\n" +
                        "hello, discord\n" +
                        "hello, discord\n"
                },
                // {name: "\u200B", value: "\u200B"},
                // {name: "Inline field title", value: "Some value here", inline: true},
                // {name: "Inline field title", value: "Some value here", inline: true},
            )
            // .addFields({name: "Inline field title", value: "Some value here", inline: true})
            // .setImage("https://i.imgur.com/AfFp7pu.png")
            .setTimestamp()
            .setFooter({
                text: "notify email made by kuro-water",
                iconURL: "attachment://icon.jpg",
            });

        await interaction.reply({embeds: [embed], files: [icon]});
    },
};