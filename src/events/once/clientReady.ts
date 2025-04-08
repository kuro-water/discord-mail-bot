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

                // チャンネルがテキストチャンネルの場合、メッセージを送信
                if (channel && channel.isTextBased()) {
                    const ch = channel as TextChannel;

                    const sent = await ch.send("メールを取得中...");
                    const icon = new AttachmentBuilder(path.join(__dirname, "../../resources/images/icon.jpg"));

                    const mails = await getEmails();
                    const embeds = mails.flatMap((mail) => mailToEmbed(mail));

                    await sent.edit(`${embeds.length}件のメールがあります`);
                    embeds.map(async (embed) => {
                        await ch.send({embeds: [embed], files: [icon]});
                    });

                } else {
                    console.error("指定されたチャンネルはテキストチャンネルではありません");
                }
            } catch (error) {
                console.error("チャンネルへのメッセージ送信中にエラーが発生しました:", error);
            }
        };

        await Schedule.start();
        // console.dir(readyClient);
    }
};