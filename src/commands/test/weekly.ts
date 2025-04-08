import {SlashCommand} from "../../@types/types";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

export const weekly: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("weekly")
        .setDescription("月曜18時になんかするよ"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply("未実装です");
    },
};
