import {ChatInputCommandInteraction, Client, Collection, SlashCommandBuilder} from "discord.js";

export interface MyClient extends Client {
    commands: Collection<string, SlashCommand>;
}

export interface SlashCommand {
    data: SlashCommandBuilder;

    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}

export interface EventOnce {
    name: string;

    execute(readyClient: Client<true>): Promise<void>;
}

export interface EventOn {
    name: string;

    execute(interaction: ChatInputCommandInteraction): Promise<void>;
}