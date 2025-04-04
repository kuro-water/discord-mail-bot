import {EmbedBuilder} from "discord.js";
import {MailInfo} from "../@types/types";

const serverToLink = (server: string) => {
    const map: { [key: string]: string } = {
        "imap.mail.yahoo.co.jp": "https://mail.yahoo.co.jp/",
        "imap.gmail.com": "https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox",
    };
    return map[server] || "";
};

const limitString = (str: string, limit: number) => {
    const dot = "...";
    return str.length < limit ? str : str.slice(0, limit - dot.length) + dot;
};

const TITLE_LIMIT = 256;
const FIELD_TITLE_LIMIT = 256;
const FIELD_VALUE_LIMIT = 256;
const AUTHOR_LIMIT = 256;

/**
 * メール情報をDiscordのEmbed形式に変換する関数
 * ポスト時、filesにnew AttachmentBuilder(path.join(__dirname, "../../resources/images/icon.jpg"))を含めること
 */
export const mailToEmbed = (mailInfo: MailInfo) => {
    return mailInfo.headers
        .filter((header) => header !== null)
        .map((header) => {
            return new EmbedBuilder()
                .setURL(serverToLink(header.server))
                .setTitle(limitString(`To:${header.to}`, TITLE_LIMIT))
                .setAuthor({name: limitString(`from:${header.from}`, AUTHOR_LIMIT)})
                .addFields(
                    {
                        name: limitString(header.subject, FIELD_TITLE_LIMIT),
                        value: limitString(header.text, FIELD_VALUE_LIMIT),
                    },
                )
                .setTimestamp()
                .setFooter({
                    text: "notify email made by kuro-water",
                    iconURL: "attachment://icon.jpg",
                });
        });
};