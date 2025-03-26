import {SlashCommand} from "../../@types/types";
import {
    ActionRowBuilder,
    ComponentType,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from "discord.js";

export const menu: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("menu")
        .setDescription("メニューのテストだよ"),
    async execute(interaction) {
        const select = new StringSelectMenuBuilder()
            .setCustomId("starter")
            .setPlaceholder("Make a selection!")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Bulbasaur")
                    .setDescription("The dual-type Grass/Poison Seed Pokémon.")
                    .setValue("bulbasaur"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Charmander")
                    .setDescription("The Fire-type Lizard Pokémon.")
                    .setValue("charmander"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Squirtle")
                    .setDescription("The Water-type Tiny Turtle Pokémon.")
                    .setValue("squirtle"),
            );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(select);

        const response = await interaction.reply({
            content: "Choose your starter!", components: [row], withResponse: true,
        });

        if (!response.resource || !response.resource.message) return;

        const collector = response.resource.message.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 3_600_000
        });

        collector.on("collect", async i => {
            const selection = i.values[0];
            await i.reply(`${i.user} has selected ${selection}!`);
        });
    },
};