export class Schedule {
    private static _isScheduled: boolean = false;
    private static timeoutId: NodeJS.Timeout | null = null;
    private static loopInterval: number = 100;

    static get isScheduled(): boolean {
        return this._isScheduled;
    }

    private static set isScheduled(value: boolean) {
        this._isScheduled = value;
    }

    static async startMinutely(execute: () => Promise<void>) {
        if (this.isScheduled) {
            return;
        }
        this.isScheduled = true;

        for (; this.isScheduled;) {
            const now = new Date();
            // 毎分0秒であったら
            if (new Date().getSeconds() === 0) {
                execute();
            }
            const next = new Date(now);
            next.setHours(now.getMinutes() !== 59 ? now.getHours() : now.getHours() + 1, (now.getMinutes() + 1) % 60, 0, 0);
            try {
                await this.wait(next.getTime() - now.getTime());
            } catch {
                return;
            }
        }
    }

    static async startHourly(execute: () => Promise<void>) {
        if (this.isScheduled) {
            return;
        }
        this.isScheduled = true;

        for (; this.isScheduled;) {
            const now = new Date();
            // 毎時0分であったら
            if (now.getMinutes() === 0) {
                execute();
            }

            const next = new Date(now);
            next.setDate(now.getHours() !== 23 ? now.getDate() : now.getDate() + 1);
            next.setHours((now.getHours() + 1) % 24, 0, 0, 0);

            try {
                await this.wait(next.getTime() - now.getTime());
            } catch {
                return;
            }
        }
    }


    static async startDaily(hour: number, minute: number, execute: () => Promise<void>) {
        if (this.isScheduled) {
            return;
        }
        this.isScheduled = true;

        for (; this.isScheduled;) {
            const now = new Date();
            if (now.getHours() === hour) {
                execute();
            }
            // const ms = 24 * 60 * 1000 - now.getMinutes() * 60 * 1000 - now.getMilliseconds();

            const next = new Date(now);
            next.setDate(now.getDate() + 1);
            next.setHours(hour, minute, 0, 0);

            try {
                await this.wait(next.getTime() - now.getTime());
            } catch {
                return;
            }
        }
    }

    static async startWeekly(day: number, hour: number, minute: number, execute: () => Promise<void>) {
        if (this.isScheduled) {
            return;
        }
        this.isScheduled = true;

        for (; this.isScheduled;) {
            const now = new Date();
            if (now.getDay() === day && now.getHours() === hour) {
                execute();
            }

            const next = new Date(now);
            next.setDate(now.getDate() + ((7 - now.getDay() + 1) % day || day));
            next.setHours(hour, minute, 0, 0);

            try {
                await this.wait(next.getTime() - now.getTime());
            } catch {
                return;
            }
        }
    }

    static async stop() {
        this.isScheduled = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        // ループが終了するまで少し待機
        await new Promise(resolve => setTimeout(resolve, Schedule.loopInterval));
    }

    private static async wait(ms: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.timeoutId = setTimeout(() => {
                resolve();
            }, ms);

            const checkInterval = setInterval(() => {
                if (!this.isScheduled) {
                    clearTimeout(this.timeoutId!);
                    clearInterval(checkInterval);
                    reject(new Error("isScheduledがfalseになりました"));
                }
            }, Schedule.loopInterval);
        });
    }
}
