import {SlashCommandBuilder} from "discord.js";
import {Command} from "../../@types/types";

export const user: Command = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("ユーザー情報を表示するよ"),
    // interaction.user は、コマンドを実行したユーザーを表すオブジェクト
    // interaction.member は、特定のギルドのユーザーを表す GuildMember オブジェクト
    async execute(interaction) {
        await interaction.reply(`${interaction.user.displayName}（${interaction.user.username}）さんは${interaction.member.joinedAt}にこのサーバーに来たよ`);
    },
};