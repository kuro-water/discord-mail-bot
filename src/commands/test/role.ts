import {ChatInputCommandInteraction, GuildMemberRoleManager, SlashCommandBuilder} from "discord.js";
import {SlashCommand} from "../../@types/types";

export const role: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("role")
        .setDescription("ロールが付与されるよ\nmissing permissionでエラーが出るよ。付与の方法がわからん"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const member = interaction.member;

        if (!interaction.guild) {
            await interaction.reply("ここはサーバーじゃないみたい。サーバー内で試してみてね");
            return;
        }

        console.log("aaaa");
        const role = interaction.guild.roles.cache.find((role) => role.name === "test");
        console.log(role);
        if (!role) {
            await interaction.reply("ロールが見つかりません");
            return;
        }
        if (!member) {
            await interaction.reply("メンバーが見つかりません");
            return;
        }
        if (!(member.roles instanceof GuildMemberRoleManager)) {
            await interaction.reply("メンバーにロールがありません");
            return;
        }

        await member.roles.add(role);
    },
};