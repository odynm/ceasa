import React from 'react'
import { hp, wp } from 'src/utils/screen'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'

const TeamCard = ({ name, onPress }) => (
	<TouchableOpacity onPress={onPress}>
		<View style={styles.card}>
			<KText bold text={name} />
		</View>
	</TouchableOpacity>
)

const styles = StyleSheet.create({
	card: {
		borderColor: colors.primary,
		borderRadius: wp(5),
		borderWidth: 1,
		paddingHorizontal: wp(20),
		paddingVertical: hp(10),
	},
})

export default TeamCard
