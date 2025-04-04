import dotenv from "dotenv";
import {Account, Env} from "./@types/types";

//.envファイルを読み込む
// usage : process.env.TOKEN
dotenv.config();

console.log("reading env");

export const env: Env = {
    TOKEN: process.env.TOKEN as string,
    CLIENT_ID: process.env.CLIENT_ID as string,
    GUILD_ID: process.env.GUILD_ID as string,
    ACCOUNTS: JSON.parse(process.env.ACCOUNTS as string) as Account[],
};