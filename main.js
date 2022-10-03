"using strict"

function celsiusToFahrenheit(celsius) {
    return celsius * 9 / 5 + 32
}

function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9
}

function calculateScore(problem, answer, t) {
    if (!checkAnswer(problem, answer)) {
        return 0
    }
    if (t < 10) {
        return 5
    } else if (t < 30) {
        return 4
    } else {
        return 3
    }
}

function calculateGrade(score) {
    if (score < 60) {
        return "F"
    } else if (score < 70) {
        return "D"
    } else {

        const onesDigit = score % 10
        let qualifier = ""
        if (onesDigit < 3) {
            qualifier = "-"
        } else if (onesDigit < 7) {
            qualifier = ""
        } else {
            qualifier = "+"
        }

        if (score < 80) {
            return "C" + qualifier
        } else if (score < 90) {
            return "B" + qualifier
        } else if (score < 100) {
            return "A" + qualifier
        } else {
            return "A+"
        }
    }
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
    return Math.round(n * 10) / 10
}

function resultAsString(problem, answer, elapsed) {
    const isCorrect = checkAnswer(problem, answer) ? "\u2705" : "\u274c"
    const correctAnswer = roundToTenth(solveProblem(problem))
    return `${isCorrect} ${problemAsString(problem)} | ${answer} (${correctAnswer}) | ${roundToTenth(elapsed*1e-3)}s`
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

function div(html) {
    const result = document.createElement("div")
    result.innerHTML = html
    return result
}

function hr() {
    return document.createElement("hr")
}

function enterOverviewMode(score) {
    document.body.prepend(hr())
    document.body.prepend(div(`Grade: ${calculateGrade(score)}`))
    document.body.prepend(div(`Final score: ${score} out of 100`))
}

function enterGameMode() {
    let startTime = null
    let problem = null
    let score = 0
    let problemNumber = 1

    const problemDiv = document.createElement("div")
    const resultsTable = document.createElement("table")
    resultsTable.border = 1
    const resultsTableHeaderRow = document.createElement("tr")
    resultsTableHeaderRow.append(th("\u{23}\u{FE0F}\u{20E3}"))
    resultsTableHeaderRow.append(th("\u{2753}"))
    resultsTableHeaderRow.append(th("\u{270F}\u{FE0F}"))
    resultsTableHeaderRow.append(th("\u{1F9E0}"))
    resultsTableHeaderRow.append(th("\u{1F916}"))
    resultsTableHeaderRow.append(th("\u{23F1}"))
    resultsTableHeaderRow.append(th("\u{1F34E}"))
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
        // save the result
        const newTableRow = document.createElement("tr")
        const correctAnswer = roundToTenth(solveProblem(problem))
        const isCorrect = checkAnswer(problem, answer) ? "\u{2705}" : "\u{274C}"
        const roundedElapsed = roundToTenth(elapsed/1000)
        const scoreIncrement = calculateScore(problem, answer, roundedElapsed)
        newTableRow.appendChild(td(problemNumber))
        newTableRow.appendChild(td(isCorrect))
        newTableRow.appendChild(td(problemAsString(problem)))
        newTableRow.appendChild(td(answer))
        newTableRow.appendChild(td(correctAnswer))
        newTableRow.appendChild(td(`${roundedElapsed}s`))
        newTableRow.appendChild(td(`+${scoreIncrement}`))
        resultsTableHeaderRow.insertAdjacentElement("afterEnd", newTableRow)

        score += scoreIncrement
        problemNumber++

        if (problemNumber <= 20) {
            startTime = Date.now()
            problem = generateProblem()
            problemDiv.innerHTML = problemAsString(problem)
            return
        }

        document.body.removeChild(problemDiv)
        document.body.removeChild(form)
        enterOverviewMode(score)
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

