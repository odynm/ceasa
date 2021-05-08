import store from 'src/ducks'

export const defaultMoney = {
    text: '',
    raw: '',
    value: 0.0,
}

const currency = {name: '', text: '', separator: ''}

const initialize = () => {
    const currencyStore = store.getState().app.currency
    currency.name = currencyStore.name
    currency.text = currencyStore.text
    currency.separator = currencyStore.separator
}

export const getCurrency = () => currency

const formatMoneyText = (text, separator) => {
    const money = defaultMoney
    const rawTextMatch = text.match(/(\d)/g)
    const rawText = rawTextMatch ? rawTextMatch.join('') : ''
    if (rawText === '') {
        return money
    }

    if (rawText.length === 1) {
        money.text = '0.0' + rawText
    } else if (rawText.length === 2) {
        money.text = '0.' + rawText
    } else {
        money.text =
            rawText.slice(0, rawText.length - 2) +
            '.' +
            rawText.slice(rawText.length - 2)
    }

    const number = parseFloat(money.text)

    money.value = number
    money.raw = text
    money.text = number.toFixed(2).replace('.', separator)

    return money
}

const textToMoney = (text) => {
    return formatMoneyText(text.replace('.', ''), currency.separator)
}

const toMoney = (number) => {
    if (
        !isNaN(number) &&
        number !== null &&
        number !== undefined &&
        typeof number === 'number'
    ) {
        if (number === 0) {
            return {
                text: '0,00',
                value: number,
            }
        }
        switch (currency.name) {
            case 'BRL':
                return {
                    text: number.toFixed(2).replace('.', ','),
                    value: number,
                }
        }
    } else {
        return defaultMoney
    }
}

const add = (a, b) => {
    const total = a.value + b.value
    return toMoney(total)
}

const MoneyService = {
    add,
    toMoney,
    initialize,
    getCurrency,
    textToMoney,
}

export default MoneyService
