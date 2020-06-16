import React from 'react'
import { hp, wp } from 'src/utils/screen'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import KText from '../ktext'
import colors from 'src/constants/colors'

const Button = ({ label, onPress }) => (
	<TouchableOpacity onPress={onPress}>
		<View style={styles.container}>
			<KText style={styles.text} bold text={label} />
		</View>
	</TouchableOpacity>
)

const styles = StyleSheet.create({
	container: {
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
