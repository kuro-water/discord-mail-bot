import {Client, Collection, Events, GatewayIntentBits, MessageFlags} from "discord.js";
import dotenv from "dotenv";
import {MyClient} from "./@types/types";
import {ping} from "./commands/utility/ping";
import {server} from "./commands/utility/server";
import {user} from "./commands/utility/user";

//.envファイルを読み込む
// usage : process.env.TOKEN
dotenv.config();

const client = new Client({intents: [GatewayIntentBits.Guilds]}) as MyClient;

// コマンド登録
client.commands = new Collection();
client.commands.set(ping.data.name, ping);
client.commands.set(server.data.name, server);
client.commands.set(user.data.name, user);

// クライアントの準備ができたら、以下のコードを実行する（一度だけ）。
// `client： Client<boolean>` と `readyClient： Client<true>` の区別は TypeScript 開発者にとって重要である。
// これはいくつかのプロパティをnull不可にする。
client.once(Events.ClientReady, readyClient => {
    console.log(`ready. Logged in as "${readyClient.user.tag}"`);
    console.dir(readyClient);
});

// インタラクションが発生したときに実行されるイベント
client.on(Events.InteractionCreate, async interaction => {
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
});

// ログイン
client.login(process.env.TOKEN);
