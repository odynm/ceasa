import React from 'react'
import { hp, fv } from 'src/utils/screen'
import { View, StyleSheet, TextInput as RNTextInput } from 'react-native'
import KText from '../ktext'
import colors from 'src/constants/colors'

const TextInput = ({ label, value, setValue }) => (
	<View style={styles.container}>
		<KText bold text={label} />
		<RNTextInput
			value={value}
			onChangeText={x => setValue(x)}
			style={styles.textInput}
		/>
	</View>
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
