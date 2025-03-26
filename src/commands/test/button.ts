import {SlashCommand} from "../../@types/types";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder} from "discord.js";

export const button: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("button")
        .setDescription("ボタンのテストだよ"),
    async execute(interaction) {
        const target = interaction.user;
        const reason = interaction.options.getString("reason") ?? "No reason provided";

        const confirm = new ButtonBuilder()
            .setCustomId("confirm")
            .setLabel("Confirm Ban")
            .setStyle(ButtonStyle.Danger);

        const cancel = new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(cancel, confirm);

        const response = await interaction.reply({
            content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
            components: [row],
            withResponse: true,
        });

        if (!response.resource || !response.resource.message) return;

        try {
            const confirmation = await response.resource.message.awaitMessageComponent({
                filter: (i: { user: { id: string; }; }) => i.user.id === interaction.user.id,
                time: 60_000
            });
            if (confirmation.customId === "confirm") {
                // await interaction.reply("ban");
                await confirmation.update({
                    content: `${target.username} has been banned for reason: ${reason}`,
                    components: []
                });
            } else if (confirmation.customId === "cancel") {
                await confirmation.update({content: "Action cancelled", components: []});
            }
        } catch (e: unknown) {
            console.log(e);
            await interaction.editReply({
                content: "Confirmation not received within 1 minute, cancelling",
                components: []
            });
        }
    }
};