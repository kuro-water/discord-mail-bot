import {SlashCommand} from "../../@types/types";
import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

export const embed: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("pingができるよ"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const sent = await interaction.reply({content: "Pinging..."});
        await interaction.followUp(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
        await interaction.editReply(`Websocket heartbeat: ${interaction.client.ws.ping}ms.`);
    },
};