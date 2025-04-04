import {ChatInputCommandInteraction, Client, Collection, SlashCommandBuilder} from "discord.js";

export interface Account {
    server: string;
    user: string;
    password: string;
}

export interface Env {
    TOKEN: string;
    CLIENT_ID: string;
    GUILD_ID: string;
    ACCOUNTS: Account[];
}

interface MailHeader {
    subject: string;
    from: string;
    to: string;
    date: string;
    text: string;
}

interface MailInfo {
    address: string;
    headers: (MailHeader | null)[];
}

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