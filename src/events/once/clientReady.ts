import {Events} from "discord.js";
import {EventOnce} from "../../@types/types";

// クライアントの準備ができたら、以下のコードを実行する（一度だけ）。
// `client： Client<boolean>` と `readyClient： Client<true>` の区別は TypeScript 開発者にとって重要である。
// これはいくつかのプロパティをnull不可にする。
export const clientReady: EventOnce = {
    name: Events.ClientReady,
    async execute(readyClient) {
        console.log(`ready. Logged in as "${readyClient.user.tag}"`);
        console.dir(readyClient);
    }
};