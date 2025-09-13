import BaseTimeHandler from "./base-time.handler"

class TimeIntervalsHandler extends BaseTimeHandler {
    constructor(
        readonly date = new Date()
    ) {
        super(date)
    }

    async *setTimeInterval( 
        seconds: number,
        onTick?: (timeRemaining: number) => void,
        onEnd?: () => void
    ): AsyncGenerator<number | false>{
        const timeEnd = Date.now() + (seconds * 1000)
        while(true){
            const timeNow = Date.now()
            if (timeNow >= timeEnd) {
                yield false
                onEnd && onEnd()
                break
            }
            const timeRemaining = timeEnd - timeNow
            yield timeRemaining
            onTick && onTick(timeRemaining)

            await new Promise(r => setTimeout(r, 1000));
        }
    }
}


export default TimeIntervalsHandler