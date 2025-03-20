import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {SlashCommand} from "../../@types/types";

export const user: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("ユーザー情報を表示するよ"),

    // interaction.user は、コマンドを実行したユーザーを表すオブジェクト
    // interaction.member は、特定のギルドのユーザーを表す GuildMember オブジェクト
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.member || !("joinedAt" in interaction.member)) {
            await interaction.reply("ここはサーバーじゃないみたい。サーバー内で試してみてね");
            console.log("interaction.member.joinedAtにアクセスできません");
            return;
        }

        await interaction.reply(`${interaction.user.displayName}（${interaction.user.username}）さんは${interaction.member.joinedAt}にこのサーバーに来たよ`);
    },
};