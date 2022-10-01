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

function resultAsString(problem, answer) {
    const isCorrect = checkAnswer(problem, answer) ? "\u2705" : "\u274c"
    const correctAnswer = roundToTenth(solveProblem(problem))
    return `${isCorrect} ${problemAsString(problem)} -> ${answer} (${correctAnswer})`;
}

let problem = generateProblem()
const problemDiv = document.getElementById("problem")
const resultsDiv = document.getElementById("results")
const form = document.getElementById("form")

problemDiv.innerHTML = problemAsString(problem)

form.addEventListener('submit', event => {
    event.preventDefault()
    // get the contents of the form
    const formData = new FormData(event.target)
    const entriesObject = Object.fromEntries(formData.entries())
    const answer = entriesObject.answer
    // clear the form
    event.target.reset()

    const newDiv = document.createElement("div")
    newDiv.innerHTML = resultAsString(problem, answer)
    resultsDiv.prepend(newDiv)

    problem = generateProblem()
    problemDiv.innerHTML = problemAsString(problem)
})
