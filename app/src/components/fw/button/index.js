import React from 'react'
import { hp, wp } from 'src/utils/screen'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import KText from '../ktext'
import colors from 'src/constants/colors'

const Button = ({
	tiny,
	small,
	label,
	style,
	onPress,
	disabled,
	textStyle,
}) => {
	const containerStyles = small
		? [styles.container, { width: wp(280) }]
		: tiny
		? [styles.container, { width: wp(140) }]
		: styles.container

	const disabledStyles = disabled
		? [containerStyles, { borderColor: colors.gray }]
		: containerStyles
	const disabledTextStyles = disabled
		? [styles.text, { color: colors.gray }]
		: styles.text

	const mergedStyles = [disabledStyles, style]
	const mergedTextStyles = [disabledTextStyles, textStyle]

	return (
		<View style={mergedStyles}>
			<TouchableOpacity
				onPress={() => {
					if (!disabled) onPress()
				}}>
				<KText style={mergedTextStyles} bold text={label} />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		alignSelf: 'center',
		borderColor: colors.primary,
		borderRadius: hp(25),
		borderWidth: hp(2),
		paddingVertical: hp(10),
		width: wp(320),
	},
	text: {
		textAlign: 'center',
	},
})

export default Button
