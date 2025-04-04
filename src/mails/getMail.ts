import imaps from "imap-simple";
import {env} from "../env";
import {MailHeader, MailInfo} from "../@types/types";
import {simpleParser} from "mailparser";

//
// const config = {
//     imap: {
//         user: env.ACCOUNTS[0].user,
//         password: env.ACCOUNTS[0].password,
//         host: "imap.gmail.com",
//         port: 993,
//         tls: true,
//         authTimeout: 3000,
//         tlsOptions: {
//             // SNI(Server Name Indication)を指定しないと接続が拒否されるっぽい？
//             // https://github.com/nodejs/node/issues/28167
//             servername: "imap.gmail.com"
//         }
//     }
// };

const config = env.ACCOUNTS.map((account) => {
    const imap: imaps.ImapSimpleOptions = {
        imap: {
            user: account.user,
            password: account.password,
            host: account.server,
            port: 993,
            tls: true,
            authTimeout: 3000,
            tlsOptions: {
                // gmailの場合、SNI(Server Name Indication)を指定しないと接続が拒否されるっぽい？
                // https://github.com/nodejs/node/issues/28167
                servername: account.server
            }
        }
    };
    return imap;
});

const getSingleAccountEmails = async (options: imaps.ImapSimpleOptions) => {
    const connection = await imaps.connect(options);
    await connection.openBox("INBOX");
    const messages = await connection.search(["UNSEEN"], {bodies: ["HEADER", "TEXT"], struct: true});
    connection.end();

    const mailHeaders = await Promise.all(messages.map(async (message) => {
        const headerPart = message.parts.find(part => part.which === "HEADER");
        const textPart = message.parts.find(part => part.which === "TEXT");
        if (headerPart) {
            const parsed = textPart ? await simpleParser(textPart.body) : null;

            const mailHeader: MailHeader = {
                subject: headerPart.body.subject[0],
                from: headerPart.body.from[0],
                to: headerPart.body.to[0],
                date: headerPart.body.date[0],
                text: parsed?.text || ""
            };
            return mailHeader;
        }

        return null;
    }));

    const mailInfo: MailInfo = {
        address: options.imap.user,
        headers: mailHeaders
    };

    return mailInfo;
};

export const getEmails = async (configs: imaps.ImapSimpleOptions[]) => {
    return await Promise.all(configs.map(config => getSingleAccountEmails(config)));
};

(async () => {
    console.dir(await getEmails(config).catch(console.error), {depth: null});
})();
