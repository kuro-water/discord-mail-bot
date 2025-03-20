import {SlashCommandBuilder} from "discord.js";
import {Command} from "../../@types/types";

export const server:Command = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("サーバー情報を表示するよ"),
    // interaction.guildは、コマンドが実行されたギルドを表すオブジェクトです。
    async execute(interaction) {
        await interaction.reply(`サーバー名：${interaction.guild.name}\nメンバー数：${interaction.guild.memberCount}`);
    },
};