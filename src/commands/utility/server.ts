import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {SlashCommand} from "../../@types/types";

export const server: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("サーバー情報を表示するよ"),
    // interaction.guildは、コマンドが実行されたギルドを表すオブジェクトです。
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply("ここはサーバーじゃないみたい。サーバー内で試してみてね");
            console.log("interaction.guildにアクセスできません");
            return;
        }
        
        await interaction.reply(`サーバー名：${interaction.guild.name}\nメンバー数：${interaction.guild.memberCount}`);
    },
};