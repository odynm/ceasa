import React from 'react'
import { hp, wp, fv } from 'src/utils/screen'
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import KText from '../ktext'
import colors from 'src/constants/colors'

const Quantity = ({ label, value, setValue }) => {
	const setQuantityText = text => {
		const number = parseInt(text)
		setValue(number)
	}

	const onClickLess = () => {
		if (value > 1) setValue(parseInt(value) - 1)
	}

	const onClickMore = () => {
		setValue(value ? parseInt(value) + 1 : 1)
	}

	return (
		<View style={styles.container}>
			<View style={styles.justify}>
				<KText bold text={label} />
			</View>
			<View style={styles.inputs}>
				<TouchableOpacity onPress={onClickLess}>
					<View style={styles.round}>
						<KText style={styles.font} text={'-'} />
					</View>
				</TouchableOpacity>
				<TextInput
					value={value > 0 ? '' + value : ''}
					onChangeText={setQuantityText}
					style={styles.text}
				/>
				<TouchableOpacity onPress={onClickMore}>
					<View style={styles.round}>
						<KText style={styles.font} text={'+'} />
					</View>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignContent: 'stretch',
		width: '100%',
		flexDirection: 'row',
	},
	justify: {
		justifyContent: 'center',
	},
	inputs: {
		alignContent: 'flex-end',
		flexDirection: 'row',
		marginLeft: 'auto',
	},
	round: {
		alignContent: 'center',
		borderColor: colors.primary,
		borderRadius: wp(30) / 2,
		borderWidth: 1,
		height: wp(30),
		width: wp(30),
	},
	font: {
		textAlign: 'center',
		fontSize: fv(22),
	},
	text: {
		borderBottomWidth: 1,
		borderColor: colors.primary,
		fontSize: fv(16),
		padding: 0,
		textAlign: 'center',
		width: wp(50),
	},
})

export default Quantity
