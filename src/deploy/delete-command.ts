/*
https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration
スラッシュ コマンドは 1 回だけ登録し、
定義 (説明、オプションなど) が変更されたときに更新する必要があります。
コマンドの作成には 1 日の制限があるため、
クライアント全体をゲートウェイに接続したり、
readyイベントごとにこれを実行したりする必要はありませんし、望ましくもありません。
このスクリプトは、スラッシュ コマンドの定義を変更する必要がある場合にのみ
個別に実行することを目的としています。再デプロイせずに、実行関数などの部分を好きなだけ変更できます。
*/

import {REST, Routes} from "discord.js";
import dotenv from "dotenv";

//.envファイルを読み込む
// usage : process.env.TOKEN
dotenv.config();

const rest = new REST().setToken(process.env.TOKEN as string);

// delete
(async () => {
    try {
        console.log("すべてのスラッシュコマンドを削除します。");

        const commands = await rest.get(
            Routes.applicationCommands(process.env.CLIENT_ID as string)
        );

        if (Array.isArray(commands)) {
            for (const command of commands) {
                await rest.delete(
                    `${Routes.applicationCommands(process.env.CLIENT_ID as string)}/${command.id}`
                );
            }
            console.log(`${commands.length}個のスラッシュコマンドを削除しました。`);
        }

    } catch (error) {
        console.error(error);
    }
})();