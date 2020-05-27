import React from 'react'
import { hp } from 'src/utils/screen'
import { View, StyleSheet } from 'react-native'

const Space = () => <View style={styles.space} />

const styles = StyleSheet.create({
	space: {
		marginBottom: hp(10),
	},
})

export default Space
