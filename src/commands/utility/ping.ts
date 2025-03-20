import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {SlashCommand} from "../../@types/types";

export const ping: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("pingができるよ"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply("ぽん");
    },
};