import {SlashCommand} from "../../@types/types";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {Schedule} from "../../schedule";

export const minutely: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("minutely")
        .setDescription("毎分0秒になんかするよ"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply("起動しました");
        Schedule.startMinutely(async () => {
            await interaction.followUp("minutely");
        });
    },
};
