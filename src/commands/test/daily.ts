import {SlashCommand} from "../../@types/types";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {Schedule} from "../../schedule";

export const daily: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("毎日18時になんかするよ"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply("起動しました");
        Schedule.startDaily(19, 0, async () => {
            await interaction.followUp("daily");
        });
    },
};
