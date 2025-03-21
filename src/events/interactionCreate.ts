import {EventOn, MyClient} from "../@types/types";
import {Events, MessageFlags} from "discord.js";

// インタラクション（スラッシュコマンドなど）が発生したときに実行されるイベント
export const interactionCreate: EventOn = {
    name: Events.InteractionCreate,

    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = (interaction.client as MyClient).commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
            console.log(`${command.data.name} コマンドを ${interaction.user.displayName}（${interaction.user.username}）が実行しました。`);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command!",
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
};