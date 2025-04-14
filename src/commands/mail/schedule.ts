import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    ComponentType,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextChannel
} from "discord.js";
import {SlashCommand} from "../../@types/types";
import {Schedule, ScheduleType} from "../../events/once/schedule";

export const schedule: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("schedule")
        .setDescription("メール通知のスケジュールを設定します"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        // 現在いるサーバーのチャンネル一覧を取得
        const guild = interaction.guild;
        if (!guild) {
            await interaction.reply("このコマンドはサーバー内で実行してください");
            return;
        }

        // サーバーのテキストチャンネルのみ抽出
        const textChannels = guild.channels.cache.filter((channel): channel is TextChannel => channel instanceof TextChannel);
        // textChannels.map((channel) => {
        //     console.log(`${channel.name}: ${channel}`);
        // });

        // チャンネル選択メニューの作成
        const scheduleTypeSelect = new StringSelectMenuBuilder()
            .setCustomId("schedule-type-select")
            .setPlaceholder("頻度を選択")
            .addOptions(Object.entries(ScheduleType).map(([str, scheduleType]) => {
                return new StringSelectMenuOptionBuilder()
                    .setLabel(scheduleType)
                    .setDescription("頻度")
                    .setValue(str);
            }));
        const channelSelect = new StringSelectMenuBuilder()
            .setCustomId("channel-select")
            .setPlaceholder("チャンネルを選択")
            .addOptions(
                textChannels.map((channel) => {
                    return new StringSelectMenuOptionBuilder()
                        .setLabel(channel.name)
                        .setDescription("テキストチャンネル")
                        .setValue(channel.id);
                })
            );
        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(scheduleTypeSelect);
        const row2 = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(channelSelect);

        // メニューを送信
        const response = await interaction.reply({
            content: "メール通知を送信するチャンネルを選んでください", components: [row, row2], withResponse: true,
        });
        if (!response.resource || !response.resource.message) return;

        // コレクタの作成
        const collector = response.resource.message.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 3_600_000 // タイムアウト時間（ms）
        });
        collector.on("collect", async i => {
            // メニューのどれかが選択されたときに実行される
            if (i.customId === "schedule-type-select") {
                const scheduleType = i.values[0];
                Schedule.scheduleType = ScheduleType[scheduleType as keyof typeof ScheduleType];
                const text = Schedule.scheduleType === ScheduleType.NONE ? "メール通知を停止します" : `${Schedule.scheduleType}メール通知を送信します`;
                console.log(text);
                await i.reply(text);
            } else if (i.customId === "channel-select") {
                const channelId = i.values[0];
                Schedule.channelId = channelId;
                const text = `${textChannels.get(channelId)}にメール通知を送信します`;
                console.log(text);
                await i.reply(text);
            }
        });
    },
};
