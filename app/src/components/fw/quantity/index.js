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
		width: '100%',
		flexDirection: 'row',
		alignContent: 'stretch',
	},
	justify: {
		justifyContent: 'center',
	},
	inputs: {
		alignContent: 'flex-end',
		marginLeft: 'auto',
		flexDirection: 'row',
	},
	round: {
		borderColor: colors.primary,
		borderRadius: hp(30) / 2,
		borderWidth: 1,
		height: hp(30),
		width: wp(30),
		alignContent: 'center',
	},
	font: {
		textAlign: 'center',
		fontSize: fv(22),
	},
	text: {
		padding: 0,
		borderBottomWidth: 1,
		borderColor: colors.primary,
		textAlign: 'center',
		fontSize: fv(16),
		width: wp(50),
	},
})

export default Quantity
