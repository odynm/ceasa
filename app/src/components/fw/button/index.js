import React from 'react'
import { hp, wp } from 'src/utils/screen'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import KText from '../ktext'
import colors from 'src/constants/colors'

const Button = ({ small, label, onPress }) => {
	const containerStyles = small
		? [styles.container, { width: wp(280) }]
		: styles.container

	return (
		<TouchableOpacity onPress={onPress}>
			<View style={containerStyles}>
				<KText style={styles.text} bold text={label} />
			</View>
		</TouchableOpacity>
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
