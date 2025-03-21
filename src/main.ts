import {Client, Collection, GatewayIntentBits} from "discord.js";
import dotenv from "dotenv";
import {EventOn, EventOnce, MyClient} from "./@types/types";
import {ping} from "./commands/utility/ping";
import {server} from "./commands/utility/server";
import {user} from "./commands/utility/user";
import {role} from "./commands/utility/role";
import {clientReady} from "./events/clientReady";
import {interactionCreate} from "./events/interactionCreate";

//.envファイルを読み込む
// usage : process.env.TOKEN
dotenv.config();

const client = new Client({intents: [GatewayIntentBits.Guilds]}) as MyClient;

// コマンド登録
client.commands = new Collection();
client.commands.set(ping.data.name, ping);
client.commands.set(server.data.name, server);
client.commands.set(user.data.name, user);
client.commands.set(role.data.name, role);


const handleInteractions = (event: EventOn | EventOnce): void => {
    if ((event as EventOnce).name) {
        client.once(event.name, async (readyClient) => {
            await event.execute(readyClient);
        });
    } else {
        client.on(event.name, async (interaction) => {
            await event.execute(interaction);
        });
    }
};

// イベント登録
handleInteractions(clientReady);
handleInteractions(interactionCreate);

// ログイン
client.login(process.env.TOKEN);