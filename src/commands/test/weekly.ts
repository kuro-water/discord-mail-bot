import {SlashCommand} from "../../@types/types";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {Schedule} from "../../schedule";

export const weekly: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("weekly")
        .setDescription("月曜18時になんかするよ"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply("起動しました");
        Schedule.startWeekly(1, 18, 0, async () => {
            await interaction.followUp("weekly");
        });
    },
};
