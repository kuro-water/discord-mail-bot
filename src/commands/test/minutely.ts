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

export const minutely: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("minutely")
        .setDescription("毎分0秒になんかするよ"),
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
            .addOptions(Object.values(ScheduleType).map((scheduleType) => {
                return new StringSelectMenuOptionBuilder()
                    .setLabel(scheduleType)
                    .setDescription("頻度")
                    .setValue(scheduleType);
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
            content: "メール通知を流すテキストチャンネルを選んでね", components: [row, row2], withResponse: true,
        });
        if (!response.resource || !response.resource.message) return;

        // コレクタの作成
        const collector = response.resource.message.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 3_600_000
        });
        collector.on("collect", async i => {
            // メニューの何れかが選択されたときに実行される
            // 正しい動きはこれではなく、[0]にどちらかユーザが選択した方の答えが入る
            // ので、どっちなのか判別して個別にセットするか、
            // メニューみたいなの開くスタイルにするか。
            const scheduleType = i.values[0];
            const selection = i.values[1];

            Schedule.scheduleType = ScheduleType[scheduleType as keyof typeof ScheduleType];
            Schedule.channelId = selection;
            console.log(`${selection}, ${textChannels.get(selection)}`);
            await i.reply(`${scheduleType}で${textChannels.get(selection)}にメール通知を送るよ`);
        });
    },
};