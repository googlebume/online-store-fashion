import BaseTimeHandler from "./base-time.handler"

class TimeIntervalsHandler extends BaseTimeHandler {
    constructor(
        readonly date = new Date()
    ) {
        super(date)
    }

    async setTimeInterval(
        seconds: number,
        onTick?: (timeLeft: number) => any,
        onEnd?: () => void
    ){
        const timeEnd = new Date(Date.now() + (seconds * 1000))

        const interval = setInterval(() => {
            const _date = new Date();
            if (_date.getTime() >= timeEnd.getTime()) {
                clearInterval(interval);
                onEnd && onEnd()
                return
            }
            const timeLeft = Math.floor(timeEnd.getTime() - _date.getTime() ) 
            onTick && onTick(timeLeft)
        }, 1000);
    }
}


export default TimeIntervalsHandler