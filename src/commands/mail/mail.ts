import {AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import * as path from "node:path";
import {SlashCommand} from "../../@types/types";
import {getEmails} from "../../mails/getMail";
import {mailToEmbed} from "../../mails/mailToEmbed";

export const mail: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("mail")
        .setDescription("未読メールをチェックします"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply("メールを取得中...");
        const icon = new AttachmentBuilder(path.join(__dirname, "../../resources/images/icon.jpg"));

        const mails = await getEmails();
        const embeds = mails.flatMap((mail) => mailToEmbed(mail));

        await interaction.editReply(`${embeds.length}件のメールがあります`);
        embeds.map(async (embed) => {
            await interaction.followUp({embeds: [embed], files: [icon]});
        });
    },
};
