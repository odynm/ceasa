import React from 'react'
import { hp, fv } from 'src/utils/screen'
import { View, StyleSheet, TextInput as RNTextInput } from 'react-native'
import KText from '../ktext'
import colors from 'src/constants/colors'
import Error from 'src/components/fw/error'

const TextInput = ({
	label,
	value,
	onBlur,
	onFocus,
	setValue,
	password,
	maxLength,
	errorMessage,
	editable = true,
}) => (
	<>
		<View style={styles.container}>
			<KText bold text={label} />
			<RNTextInput
				value={value}
				onBlur={onBlur}
				onFocus={onFocus}
				editable={editable}
				maxLength={maxLength}
				style={styles.textInput}
				secureTextEntry={password}
				onChangeText={x => setValue(x)}
			/>
		</View>
		<Error text={errorMessage} />
	</>
)

const styles = StyleSheet.create({
	container: {
		borderBottomColor: colors.gray,
		borderBottomWidth: 1,
	},
	textInput: {
		fontSize: fv(16),
		padding: 0,
		paddingTop: hp(3),
	},
})

export default TextInput
