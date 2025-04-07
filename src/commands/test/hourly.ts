import {SlashCommand} from "../../@types/types";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {Schedule} from "../../schedule";

export const hourly: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("hourly")
        .setDescription("毎時0分になんかするよ"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply("起動しました");
        Schedule.startHourly(async () => {
            await interaction.followUp("hourly");
        });
    },
};
