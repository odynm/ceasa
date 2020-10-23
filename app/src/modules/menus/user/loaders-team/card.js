import React from 'react'
import { hp, wp } from 'src/utils/screen'
import { translate } from 'src/i18n/translate'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'

const TeamCard = ({ name, onDelete }) => (
	<View style={styles.card}>
		<View style={styles.text}>
			<KText bold text={name} />
		</View>
		<View style={styles.button}>
			<TouchableOpacity onPress={onDelete}>
				<KText bold text={translate('user.loadersTeam.delete')} />
			</TouchableOpacity>
		</View>
	</View>
)

const styles = StyleSheet.create({
	card: {
		borderColor: colors.primary,
		borderRadius: wp(5),
		borderWidth: 1,
		paddingHorizontal: wp(20),
		paddingVertical: hp(10),
		flexDirection: 'row',
	},
	text: {
		flex: 1,
	},
	button: {
		borderRadius: wp(10),
		borderWidth: 1,
		borderColor: colors.primary,
		width: wp(70),
		alignItems: 'center',
		justifyContent: 'center',
	},
})

export default TeamCard
