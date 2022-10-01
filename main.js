"using strict"

function celsiusToFahrenheit(celsius) {
    return celsius * 9 / 5 + 32
}

function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9
}

function randomInteger() {
    if (arguments.length == 0) {
        throw new Error("range unspecified")
    } else if (arguments.length == 1) {
        return Math.trunc(Math.random() * arguments[0])
    } else {
        return Math.trunc(Math.random() * (arguments[1] - arguments[0]) + arguments[0])
    }
}

function generateProblem() {
    const coinFlip = randomInteger(2)
    if (coinFlip) {
        return { fahrenheit: randomInteger(32, 100) }
    } else {
        return { celsius: randomInteger(0, 50) }
    }
}

function approxEqual(a, b, errorMargin) {
    return Math.abs(a - b) < errorMargin
}

function checkAnswer(problem, answer) {
    if (!!problem.fahrenheit) {
        return approxEqual(answer,
            fahrenheitToCelsius(problem.fahrenheit),
            2)
    } else {
        return approxEqual(answer,
            celsiusToFahrenheit(problem.celsius),
            2)

    }
}

function solveProblem(problem) {
    if (!!problem.fahrenheit) {
        return fahrenheitToCelsius(problem.fahrenheit)
    } else {
        return celsiusToFahrenheit(problem.celsius)
    }
}

function problemAsString(problem) {
    if (!!problem.fahrenheit) {
        return `${problem.fahrenheit} °F = ? °C`
    } else {
        return `? °F = ${problem.celsius} °C`
    }
}

function roundToTenth(n) {
    return Math.round(n * 10) / 10;
}

function resultAsString(problem, answer, elapsed) {
    const isCorrect = checkAnswer(problem, answer) ? "\u2705" : "\u274c"
    const correctAnswer = roundToTenth(solveProblem(problem))
    return `${isCorrect} ${problemAsString(problem)} | ${answer} (${correctAnswer}) | ${roundToTenth(elapsed*1e-3)}s`;
}

function th(html) {
    const result = document.createElement("th")
    result.innerHTML = html
    return result
}

function td(html) {
    const result = document.createElement("td")
    result.innerHTML = html
    return result
}

function enterGameMode() {
    let startTime = null
    let problem = null

    const problemDiv = document.createElement("div")
    const resultsTable = document.createElement("table")
    resultsTable.border = 1
    const resultsTableHeaderRow = document.createElement("tr")
    resultsTableHeaderRow.append(th("\u{2753}"))
    resultsTableHeaderRow.append(th("\u{270F}"))
    resultsTableHeaderRow.append(th("\u{1F9E0}"))
    resultsTableHeaderRow.append(th("\u{1F916}"))
    resultsTableHeaderRow.append(th("\u{23F1}"))
    resultsTable.append(resultsTableHeaderRow)
    const answerInput = document.createElement("input")
    answerInput.type = "text"
    answerInput.name = "answer"
    const submitInput = document.createElement("input")
    submitInput.type = "submit"
    const form = document.createElement("form")
    form.append(answerInput, submitInput)
    form.addEventListener('submit', event => {
        event.preventDefault()
        // get the contents of the form
        const formData = new FormData(event.target)
        const entriesObject = Object.fromEntries(formData.entries())
        const answer = entriesObject.answer
        const elapsed = Date.now() - startTime
        // clear the form
        event.target.reset()

        const newTableRow = document.createElement("tr")
        const correctAnswer = roundToTenth(solveProblem(problem))
        const isCorrect = checkAnswer(problem, answer) ? "\u{2705}" : "\u{274C}"
        newTableRow.appendChild(td(isCorrect))
        newTableRow.appendChild(td(problemAsString(problem)))
        newTableRow.appendChild(td(answer))
        newTableRow.appendChild(td(correctAnswer))
        newTableRow.appendChild(td(`${roundToTenth(elapsed/1000)} s`))
        resultsTableHeaderRow.insertAdjacentElement("afterEnd", newTableRow)

        startTime = Date.now()
        problem = generateProblem()
        problemDiv.innerHTML = problemAsString(problem)
    })

    document.body.append(problemDiv)
    document.body.append(form)
    document.body.append(resultsTable)

    startTime = Date.now()
    problem = generateProblem()
    problemDiv.innerHTML = problemAsString(problem)
    answerInput.focus()
}

const startButton = document.createElement("button")
startButton.innerHTML = "Start!"
document.body.append(startButton)
startButton.addEventListener("click", event => {
    document.body.removeChild(event.target)
    enterGameMode()
})

