export enum ScheduleType {
    NONE = "無し",
    MINUTELY = "毎分",
    HOURLY = "毎時",
    DAILY = "毎日",
}

export class Schedule {
    private static _isScheduled: boolean = false;
    private static lastExecutionTime: Date; // これで管理していこう
    static scheduleType: ScheduleType = ScheduleType.NONE;
    static channelId: string; // 送信先のチャンネルID

    static get isScheduled(): boolean {
        return this._isScheduled;
    }

    private static set isScheduled(value: boolean) {
        this._isScheduled = value;
    }

    private ScheduleExecute(): void {
    }

    static async execute(): Promise<void> {
        console.log("ScheduleExecute default function");
    };

    static checkScheduleType(now: Date): boolean {
        // console.log(`ScheduleType: ${this.scheduleType}`);
        if (!this.lastExecutionTime) {
            // 初回実行時処理
            // ScheduleTypeがNONEでなければ実行
            this.lastExecutionTime = new Date();
            return this.scheduleType !== ScheduleType.NONE;
        }

        // クローン作成
        // CはCloneのC
        const nowC = new Date(now.getTime());
        const lastExecutionTimeC = new Date(this.lastExecutionTime.getTime());
        switch (this.scheduleType) {
            case ScheduleType.NONE:
                return false;
            case ScheduleType.MINUTELY: {
                // 秒以下を無視し、それ以外が一致していればfalse
                nowC.setSeconds(0, 0);
                lastExecutionTimeC.setSeconds(0, 0);
                return lastExecutionTimeC.getTime() !== nowC.getTime();
            }
            case ScheduleType.HOURLY: {
                // 分秒以下を無視し、それ以外が一致していればfalse
                nowC.setMinutes(0, 0, 0);
                lastExecutionTimeC.setMinutes(0, 0, 0);
                return lastExecutionTimeC.getTime() !== nowC.getTime();
            }
            case ScheduleType.DAILY: {
                // 時分秒以下を無視し、それ以外が一致していればfalse
                nowC.setHours(0, 0, 0, 0);
                lastExecutionTimeC.setHours(0, 0, 0, 0);
                return lastExecutionTimeC.getTime() !== nowC.getTime();
            }
        }
    }

    static async start(): Promise<void> {
        if (this.isScheduled) {
            console.log("すでにスケジュールが実行中です");
            return;
        }
        this.isScheduled = true;
        console.log("スケジュールを開始します");

        for (; this.isScheduled;) {
            const now = new Date();
            if (this.checkScheduleType(now)) {
                await this.execute();
                this.lastExecutionTime = now;
            }

            // 次の秒まで待機
            await this.wait(1000 - new Date().getMilliseconds());
        }
    }

    static async stop(): Promise<void> {
        this.isScheduled = false;
    }

    private static async wait(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(() => resolve(), ms));
    }
}
