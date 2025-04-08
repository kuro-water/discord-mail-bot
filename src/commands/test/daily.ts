import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {Schedule, ScheduleType} from "../../events/once/schedule";
import { SlashCommand} from "../../@types/types";

export const daily: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("毎日0時になんかするよ"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        Schedule.scheduleType = ScheduleType.DAILY;
        await interaction.reply("起動しました");
    },
};
