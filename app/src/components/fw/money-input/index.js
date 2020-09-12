import React, { useState, useEffect } from 'react'
import { hp, fv, wp } from 'src/utils/screen'
import { View, StyleSheet, TextInput as RNTextInput } from 'react-native'
import KText from '../ktext'
import colors from 'src/constants/colors'
import Error from 'src/components/fw/error'
import MoneyService, { defaultMoney } from 'src/services/moneyService'

//Dirty trick :(
let reseting = false

const MoneyInput = ({ max, label, value, setValue, errorMessage }) => {
	const [inputText, setInputText] = useState(value.text)

	useEffect(() => {
		return () => {
			reseting = true
			setInputText('')
			setValue(defaultMoney)
		}
	}, [])

	useEffect(() => {
		if (reseting) {
			reseting = false
		} else {
			handleChange(value.text)
		}
	}, [value])

	const handleChange = text => {
		if (text === undefined || text.length > value.raw + 1) {
			setValue(defaultMoney)
			return
		}
		if (text.length > ('' + max).length + 3) {
			return
		}
		const money = MoneyService.textToMoney(text)

		setInputText(money.text)
		setValue(money)
	}

	return (
		<View>
			<View style={styles.row}>
				<KText bold text={label} />
				<View style={styles.right}>
					<KText bold text={MoneyService.getCurrency().text} />
					<View style={styles.inputContainer}>
						<RNTextInput
							keyboardType={'number-pad'}
							value={inputText}
							style={styles.textInput}
							onChangeText={handleChange}
						/>
					</View>
				</View>
			</View>
			<View style={styles.error}>
				<Error text={errorMessage} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	row: {
		marginTop: hp(15),
		flexDirection: 'row',
		width: '100%',
	},
	right: {
		flexDirection: 'row',
		marginLeft: 'auto',
		marginRight: 0,
	},
	error: {
		marginLeft: 'auto',
		marginRight: 0,
		marginTop: -hp(15),
	},
	inputContainer: {
		borderBottomColor: colors.gray,
		borderBottomWidth: 1,
		bottom: hp(15),
	},
	textInput: {
		fontSize: fv(16),
		textAlign: 'right',
		padding: 0,
		paddingRight: hp(5),
		bottom: hp(-5),
		marginLeft: wp(10),
		width: wp(60),
	},
})

export default MoneyInput
