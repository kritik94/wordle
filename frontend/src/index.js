import ReactDOM from "react-dom";
import { App } from "./App";

if (module.hot) {
  module.hot.accept();
}

const app = document.getElementById("app");
ReactDOM.render(<App />, app);



// cons
const LETTER_STATE_EMPTY = "empty"
const LETTER_STATE_GUESSED = "guessed"
const LETTER_STATE_PRESENT = "present"

const GAME_STATE_INIT = "init"
const GAME_STATE_PLAY = "play"
const GAME_STATE_WINNED = "winned"
const GAME_STATE_LOOSED = "loosed"

// util
function repeat(cnt, fn) {
    for (let i = 0; i < cnt; i++) {
        fn(i)
    }
}

function skip(arr, cnt) {
    return arr.filter((_, i) => i >= cnt)
}

// initialize
let ref = {
    fields: [],
    gameMessage: null,
    gameScore: null,
}
let data = {
}

function init() {
    // ref init
    let mainEl = document.getElementById("main")
    repeat(25, () => {
        let field = document.createElement("div")
        field.className = "field"

        mainEl.appendChild(field)
        ref.fields.push(field)
    })

    ref.gameMessage = document.getElementById("status-message")
    ref.gameScore = document.getElementById("status-score")

    // data init
    data["ru"] = {
        words: Object.keys(wordle_ru),
        defenitions: wordle_ru,
    }

    // start
    submitInit()
}

function handleKey(ev) {
    if (state.gameState === GAME_STATE_PLAY) {
        if (ev.code === "Enter") {
            return submitWord()
        }
        if (ev.code === "Backspace") {
            return submitDeleteLetter()
        }

        if (ev.key.length === 1) {
            return submitLetter(ev.key)
        }
    }

    if ([GAME_STATE_LOOSED, GAME_STATE_WINNED].includes(state.gameState) && ev.code === "Space") {
        return submitInit()
    }
}

// window.addEventListener("load", init)
// window.addEventListener("keydown", handleKey)

// events
let state = initState()

function initState() {
    return {
        gameState: GAME_STATE_INIT,
        gameMessage: "",

        targetWord: null,
        grid: [],
        input: [],
    }
}

function submitRender() {
    ref.gameScore.innerHTML = `${state.grid.length / 5} / 5`

    state.grid.forEach(({letter, state: status}, i) => {
        let el = ref.fields[i]
        el.innerHTML = letter
        el.className = `field field-${status}`
    })

    state.input.forEach((letter, i) => {
        let el = ref.fields[state.grid.length + i]
        el.innerHTML = letter
        el.className = `field`
    })

    skip(ref.fields, state.grid.length + state.input.length).forEach(el => {
        el.innerHTML = ""
        el.className = `field`
    })

    if (state.gameState === GAME_STATE_WINNED) {
        ref.gameMessage.innerHTML = "🥳 Congratulation!<br/>Press Space to new game"
    }
    if (state.gameState === GAME_STATE_LOOSED) {
        ref.gameMessage.innerHTML = "🙈 Loosed.<br/>Press Space to new game"
    }
    if (state.gameState === GAME_STATE_PLAY) {
        ref.gameMessage.innerHTML = state.gameMessage
    }
}

function submitInit() {
    let randInt = Math.floor(Math.random() * data.ru.words.length)
    let word = data.ru.words[randInt]

    state = {
        ...initState(),
        gameState: GAME_STATE_PLAY,
        targetWord: word,
    }

    submitRender()
}

function submitWord() {
    if (state.input.length != 5) {
        return
    }

    let word = state.input.join("")

    let letters = state.input.map((letter, i) => {
        if (state.targetWord[i] === letter) {
            return {letter, state: LETTER_STATE_GUESSED}
        }
        if (state.targetWord.indexOf(letter) !== -1) {
            return {letter, state: LETTER_STATE_PRESENT}
        }
        return {letter, state: LETTER_STATE_EMPTY}
    })

    state.input = []
    state.grid = [...state.grid, ...letters]

    if (word === state.targetWord) {
        state.gameState = GAME_STATE_WINNED
    } else if (state.grid.length >= 25) {
        state.gameState = GAME_STATE_LOOSED
    }


    submitRender()
}

function submitDeleteLetter() {
    if (state.input.length == 0) {
        return
    }

    state.input.pop()
    submitRender()
}

function submitLetter(letter) {
    if (state.input.length >= 5) {
        return
    }

    state.input.push(letter)
    submitRender()
}

