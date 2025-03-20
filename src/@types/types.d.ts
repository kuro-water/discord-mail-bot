import {Client, Collection} from "discord.js";

export interface MyClient extends Client {
    commands: Collection<string, Command>;
}

export interface Command {
    data;
    execute(interaction): Promise<void>;
}