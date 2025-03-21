import {Client, Collection, GatewayIntentBits} from "discord.js";
import dotenv from "dotenv";
import {EventOn, EventOnce, MyClient} from "./@types/types";
import {commandList} from "./commands/commandList";
import {eventList} from "./events/eventList";

//.envファイルを読み込む
// usage : process.env.TOKEN
dotenv.config();

const client = new Client({intents: [GatewayIntentBits.Guilds]}) as MyClient;

// コマンド登録
client.commands = new Collection();
commandList.map((command) => {
    client.commands.set(command.data.name, command);
});


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
eventList.map((event) => {
    handleInteractions(event);
});

// ログイン
client.login(process.env.TOKEN);