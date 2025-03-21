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
import {commandList} from "../commands/commandList";
import {SlashCommand} from "../@types/types";

//.envファイルを読み込む
// usage : process.env.TOKEN
dotenv.config();

// 登録するコマンド
const commands =
    commandList.map((command: SlashCommand) => command.data.toJSON());

const rest = new REST().setToken(process.env.TOKEN as string);

// deploy
(async () => {
    try {
        console.log(`${commands.length}個のスラッシュコマンドを登録します。`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID as string),
            {body: commands},
        );

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        console.log(`${data.length}個のスラッシュコマンドを登録しました。`);
    } catch (error) {
        console.error(error);
    }
})();