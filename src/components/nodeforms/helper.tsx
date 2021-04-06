import delay from "delay";

export const timeoutMillis = 2000;

export async function delayNotification() {
    await delay(timeoutMillis);
}
