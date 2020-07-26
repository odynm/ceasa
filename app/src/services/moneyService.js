export const defaultMoney = {
	text: '',
	raw: '',
	value: 0.0,
}

const formatMoneyText = (text, separator) => {
	const money = defaultMoney
	const rawTextMatch = text.match(/(\d)/g)
	const rawText = rawTextMatch ? rawTextMatch.join('') : ''
	if (rawText === '') {
		return money
	}

	if (rawText.length > 2) {
		money.text =
			rawText.slice(0, rawText.length - 2) +
			'.' +
			rawText.slice(rawText.length - 2)
	} else if (rawText.length === 1) {
		money.text = '0.0' + rawText
	} else {
		money.text = '0.' + rawText
	}

	const number = parseFloat(money.text)
	if (number > 9999) {
		return
	}

	money.value = number
	money.raw = text
	money.text = number.toFixed(2).replace('.', separator)

	return money
}

const textToMoney = (text, currency) => {
	switch (currency) {
		case 'BRL':
			return formatMoneyText(text, ',')
	}
}

const MoneyService = {
	textToMoney,
}

export default MoneyService
