import React from 'react'
import { fv } from 'src/utils/screen'
import { Text, StyleSheet } from 'react-native'
import colors from 'src/constants/colors'

const KText = ({ style, text, bold }) => {
	const weightStyle = bold ? styles.bold : styles.regular
	const mergedStyles = { ...styles.font, ...weightStyle }
	return <Text style={[mergedStyles, style]}>{text}</Text>
}

const styles = StyleSheet.create({
	font: {
		color: colors.primary,
		fontSize: fv(16),
	},
	regular: {
		fontFamily: 'NotoSansBengaliUI-Regular',
	},
	bold: {
		fontFamily: 'NotoSansBengaliUI-Bold',
	},
})

export default KText
