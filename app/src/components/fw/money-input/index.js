import React, { useState } from 'react'
import { hp, fv, wp } from 'src/utils/screen'
import { View, StyleSheet, TextInput as RNTextInput } from 'react-native'
import KText from '../ktext'
import colors from 'src/constants/colors'
import Error from 'src/components/fw/error'
import MoneyService, { defaultMoney } from 'src/services/moneyService'

const MoneyInput = ({ label, value, setValue, errorMessage }) => {
	const [inputText, setInputText] = useState(value.text)

	const handleChange = text => {
		if (text === undefined || text.length > value.raw + 1) {
			setValue(defaultMoney)
			return
		}
		const money = MoneyService.textToMoney(text, 'BRL')

		setInputText(money.text)
		setValue(money)
	}

	return (
		<>
			<View style={styles.row}>
				<KText bold text={label} />
				<View style={styles.right}>
					{/* TODO: make the currency type configurable in a ducks */}
					<KText bold text={'R$'} />
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
			<Error text={errorMessage} />
		</>
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
