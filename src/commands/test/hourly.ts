import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {Schedule, ScheduleType} from "../../events/once/schedule";
import { SlashCommand} from "../../@types/types";

export const hourly: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("hourly")
        .setDescription("毎時0分になんかするよ"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        Schedule.scheduleType = ScheduleType.HOURLY;
        await interaction.reply("起動しました");
    },
};
