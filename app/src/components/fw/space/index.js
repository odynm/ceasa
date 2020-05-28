import React from 'react'
import { hp } from 'src/utils/screen'
import { View, StyleSheet } from 'react-native'

const Space = ({ size2 }) => (
	<View style={size2 ? styles.space2 : styles.space} />
)

const styles = StyleSheet.create({
	space: {
		marginBottom: hp(10),
	},
	space2: {
		marginBottom: hp(20),
	},
})

export default Space
