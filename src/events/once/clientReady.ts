import {AttachmentBuilder, Events, TextChannel} from "discord.js";
import path from "node:path";
import {EventOnce} from "../../@types/types";
import {getEmails} from "../../mails/getMail";
import {mailToEmbed} from "../../mails/mailToEmbed";
import {Schedule} from "./schedule";

// クライアントの準備ができたら、以下のコードを実行する（一度だけ）。
// `client： Client<boolean>` と `readyClient： Client<true>` の区別は TypeScript 開発者にとって重要である。
// これはいくつかのプロパティをnull不可にする。
export const clientReady: EventOnce = {
    name: Events.ClientReady,
    async execute(readyClient) {
        console.log(`ready. Logged in as "${readyClient.user.tag}"`);
        Schedule.execute = async () => {
            try {
                // チャンネルを取得
                const channel = await readyClient.channels.fetch(Schedule.channelId);

                // テキストチャンネルであることを確認
                if (!channel || !channel.isTextBased()) {
                    console.error(`${Schedule.channelId}はテキストチャンネルではありません`);
                    return;
                }
                console.log("メールを取得中...");
                const ch = channel as TextChannel;
                const icon = new AttachmentBuilder(path.join(__dirname, "../../resources/images/icon.jpg"));

                try {
                    const mails = await getEmails();
                    const embeds = mails.flatMap((mail) => mailToEmbed(mail));

                    if (embeds.length === 0) {
                        console.log("メールはありませんでした");
                        return;
                    }
                    await ch.send(`${embeds.length}件のメールがあります`);
                    console.log(`${embeds.length}件のメールがあります`);
                    embeds.map(async (embed) => {
                        await ch.send({embeds: [embed], files: [icon]});
                    });
                } catch (e) {
                    console.error("メールの取得中にエラーが発生しました:", e);
                    await ch.send(`メールの取得中にエラーが発生しました: ${e}`);
                }
            } catch (error) {
                console.error("チャンネルへのメッセージ送信中にエラーが発生しました:", error);
            }
        };

        await Schedule.start();
        // console.dir(readyClient);
    }
};