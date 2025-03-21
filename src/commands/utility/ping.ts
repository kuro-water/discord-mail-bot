import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import {SlashCommand} from "../../@types/types";

export const ping: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("pingができるよ"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const sent = await interaction.reply({content: "Pinging..."});
        await interaction.followUp(`Roundtrip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
        await interaction.editReply(`Websocket heartbeat: ${interaction.client.ws.ping}ms.`);
    },
};