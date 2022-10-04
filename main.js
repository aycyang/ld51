"using strict"

class Result {
    constructor(problemNumber, problem, answer, elapsed) {
        this.problemNumber = problemNumber
        this.problem = problem
        this.answer = answer
        this.elapsed = elapsed // in seconds, not milliseconds
    }

    score() {
        if (!this.check()) {
            return 0
        }
        const roundedElapsed = roundToTenth(this.elapsed)
        if (roundedElapsed <= 10) {
            return 5
        } else if (roundedElapsed <= 20) {
            return 4
        } else if (roundedElapsed <= 30) {
            return 3
        } else if (roundedElapsed <= 45) {
            return 2
        } else {
            return 1
        }
    }

    check() {
        if (!!this.problem.fahrenheit) {
            return approxEqual(this.answer,
                fahrenheitToCelsius(this.problem.fahrenheit),
                2)
        } else {
            return approxEqual(this.answer,
                celsiusToFahrenheit(this.problem.celsius),
                2)

        }
    }

    toTableRow() {
        const newTableRow = document.createElement("tr")
        const correctAnswer = roundToTenth(solveProblem(this.problem))
        const isCorrect = this.check() ? "\u{2705}" : "\u{274C}"
        const roundedElapsed = roundToTenth(this.elapsed)
        const scoreIncrement = this.score()
        newTableRow.appendChild(td(this.problemNumber))
        newTableRow.appendChild(td(isCorrect))
        newTableRow.appendChild(td(problemAsString(this.problem)))
        newTableRow.appendChild(td(this.answer))
        newTableRow.appendChild(td(correctAnswer))
        newTableRow.appendChild(td(`${roundedElapsed}s`))
        newTableRow.appendChild(td(`+${scoreIncrement}`))
        return newTableRow
    }
}

function celsiusToFahrenheit(celsius) {
    return celsius * 9 / 5 + 32
}

function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9
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
    return Math.abs(a - b) <= errorMargin
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

function br() {
    return document.createElement("br")
}

function hr() {
    return document.createElement("hr")
}

function overviewTableRow(label, value) {
    const result = document.createElement("tr")
    const labelTd = td(label)
    labelTd.style = "text-align:right;"
    const valueTd = td(value)
    valueTd.style = "text-align:left;"
    result.append(labelTd, valueTd)
    return result
}

function overviewTimeBar(result) {
    const height = Math.max(5, Math.min(120,
        Math.trunc(result.elapsed * 2)))
    const barSpan = document.createElement("span")
    barSpan.className = `${result.check() ? "green" : "red"} bar`
    barSpan.style = `height:${height}px;`
    return barSpan

}

function overviewTimeBarChart(results) {
    const barchartDiv = document.createElement("div")
    barchartDiv.className = "barchart"
    barchartDiv.append(...results.map(overviewTimeBar))

    const baselineDiv = div("")
    baselineDiv.className = "baseline"
    barchartDiv.prepend(baselineDiv)
    for (let i = 0; i < 6; i++) {
        const guidelineDiv = div(`${(i+1)*10}s`)
        guidelineDiv.className = "guideline"
        guidelineDiv.style = `margin-bottom:${i*20}px;`
        barchartDiv.prepend(guidelineDiv)
    }
    return barchartDiv
}


function enterOverviewMode(results) {
    const score = results.map(r => r.score()).reduce((a, b) => a + b)
    const numCorrect = results.map(r => r.check() ? 1 : 0).reduce((a, b) => a + b)
    const avgTime = roundToTenth(results.map(r => r.elapsed).reduce((a, b) => a + b) / results.length)
    const overviewTable = document.createElement("table")
    const overviewTableDiv = div("")
    overviewTableDiv.append(overviewTable)
    overviewTableDiv.style = "display:flex;justify-content:center;"
    overviewTable.append(overviewTableRow("<b>Number correct:</b>", `${numCorrect} out of 20`))
    overviewTable.append(overviewTableRow("<b>Average time:</b>", `${avgTime}s`))
    overviewTable.append(overviewTableRow("<b>Final score:</b>", `${score} out of 100`))
    document.body.prepend(overviewTimeBarChart(results))
    document.body.prepend(overviewTableDiv)

    const resetButton = document.createElement("button")
    resetButton.innerHTML = "Try again?"
    resetButton.style = "padding:12px 24px;font-size:18px;"
    const resetButtonDiv = div("")
    resetButtonDiv.append(resetButton)
    resetButtonDiv.style = "display:flex;justify-content:center;margin:12px"
    document.body.prepend(resetButtonDiv)
    resetButton.addEventListener("click", event => {
        while (document.body.lastChild) {
            document.body.removeChild(document.body.lastChild)
        }
        enterGameMode()
    })
}

function enterGameMode() {
    let startTime = null
    let problem = null
    let problemNumber = 1
    let results = []

    const problemDiv = document.createElement("div")
    problemDiv.style = "display:flex;justify-content:center;font-size:24px;margin:18px 0 12px 0;"
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
    answerInput.type = "number"
    answerInput.step = "0.1"
    answerInput.name = "answer"
    answerInput.style = "font-size:24px;width:120px;margin:0 4px;"
    const submitInput = document.createElement("input")
    submitInput.type = "submit"
    submitInput.style = "font-size:18px;margin:0 4px;"
    const form = document.createElement("form")
    form.style = "display:flex;justify-content:center;"
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
        const result = new Result(problemNumber, problem, answer, elapsed/1000)
        results.push(result)
        const newTableRow = result.toTableRow()
        resultsTableHeaderRow.insertAdjacentElement("afterEnd", newTableRow)

        problemNumber++

        if (problemNumber <= 20) {
            startTime = Date.now()
            problem = generateProblem()
            problemDiv.innerHTML = problemAsString(problem)
            return
        }

        document.body.removeChild(problemDiv)
        document.body.removeChild(form)
        enterOverviewMode(results)
    })

    document.body.append(problemDiv)
    document.body.append(form)
    document.body.append(hr())
    const resultsTableDiv = div("")
    resultsTableDiv.append(resultsTable)
    resultsTableDiv.style = "display:flex;justify-content:center;"
    document.body.append(resultsTableDiv)

    startTime = Date.now()
    problem = generateProblem()
    problemDiv.innerHTML = problemAsString(problem)
    answerInput.focus()
}

const startButton = document.createElement("button")
startButton.innerHTML = "Start!"
startButton.style = "padding:12px 24px;font-size:18px;"
const startButtonDiv = div("")
startButtonDiv.append(startButton)
startButtonDiv.style = "display:flex;justify-content:center;margin:12px;"
document.body.append(startButtonDiv)
startButton.addEventListener("click", event => {
    while (document.body.lastChild) {
        document.body.removeChild(document.body.lastChild)
    }
    enterGameMode()
})
