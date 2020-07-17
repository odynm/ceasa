import React from 'react'
import { fv } from 'src/utils/screen'
import { StyleSheet } from 'react-native'
import KText from '../ktext'
import colors from 'src/constants/colors'

const Error = ({ text }) => {
	return <KText style={styles.text} text={text} />
}

const styles = StyleSheet.create({
	text: {
		color: colors.red,
		fontSize: fv(12),
	},
})

export default Error
