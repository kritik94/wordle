function repeat(cnt, fn) {
    let res = []
    for (let i = 0; i < cnt; i++) {
        res.push(fn(i))
    }
    return res
}

const randInt = to => Math.floor(Math.random() * to)
const randLetter = () => "qwertyuiopasdfghjklzxcvbnm".split("")[randInt(26)]
const randStatus = () => ["empty", "filled", "exists", "guessed"][randInt(4)]

export function App() {
    let state = {
        message: {
            result: "Congrats!",
            hint: "Press Space",
        },
        words: repeat(6, _ => {
            return repeat(5, _ => ({
                val: randLetter(),
                status: randStatus(),
            }))
        })
    }
    console.log(state)

    return <div className="font-sans grid grid-cols-6 box-border gap-2 md:mx-40 lg:mx-54">
        <h1 className="justify-self-center col-start-1 col-end-7 text-3xl">Wordle</h1>
        <Message className="col-start-2 col-span-4" {...state.message}/>
        <Score className="col-start-6" from={0} to={6} />
        <div className="col-start-1 col-span-6 flex flex-column flex-wrap gap-4 justify-self-center">
            {state.words.map(word => <Word {...{letters: word}}/>)}
        </div>
    </div>
}

function Message({result, hint, className}) {
    return <div className={`justify-self-center ${className}`}>
        <div className="text-2xl">{result}</div>
        <div>{hint}</div>
    </div>
}

function Score({from, to, className}) {
    return <div className={`flex items-center justify-left text-2xl ${className}`}>{from}/{to}</div>
}

function Word({letters}) {
    return <div className="flex flex-row flex-nowrap w-full justify-between">
        {letters.map(letter => <Letter {...letter}/>)}
    </div>
}

function Letter({val, status}) {
    let statusToBg = {
        "empty": "",
        "filled": "bg-slate-300",
        "exists": "bg-amber-500",
        "guessed": "bg-emerald-500",
    }
    console.log(statusToBg[status])

    return <div
        className={`flex items-center justify-center border-2 border-gray-300 w-1/6 h-[12vmin] text-2xl ${statusToBg[status]}`}
    >
        {val}
    </div>
}
