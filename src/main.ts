import {Client, Events, GatewayIntentBits} from "discord.js";
import dotenv from "dotenv";

//.envファイルを読み込む
// usage : process.env.TOKEN
dotenv.config();

const client = new Client({intents: [GatewayIntentBits.Guilds]});

// クライアントの準備ができたら、以下のコードを実行する（一度だけ）。
// `client： Client<boolean>` と `readyClient： Client<true>` の区別は TypeScript 開発者にとって重要である。
// これはいくつかのプロパティをnull不可にする。
client.once(Events.ClientReady, readyClient => {
    console.log(`ready. Logged in as "${readyClient.user.tag}"`);
    console.dir(readyClient);
});

client.login(process.env.TOKEN);