import {SlashCommandBuilder} from "discord.js";
import {Command} from "../../@types/types";

export const ping: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("pingができるよ"),
    async execute(interaction) {
        await interaction.reply("ぽん");
    },
};