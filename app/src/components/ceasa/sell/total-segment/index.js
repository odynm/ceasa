import React from 'react'
import { hp } from 'src/utils/screen'
import { translate } from 'src/i18n/translate'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import KText from 'src/components/fw/ktext'
import MoneyService from 'src/services/moneyService'

const TotalSegment = ({ setOpenAddMenu, totalPrice }) => (
	<View style={styles.totalRow}>
		<View style={styles.totalRowInside}>
			<KText
				bold
				fontSize={24}
				style={styles.rowAlignText}
				text={`${translate('sell.total')} `}
			/>
			<KText
				bold
				fontSize={24}
				style={styles.rowAlignText}
				text={`${MoneyService.getCurrency().text} ${totalPrice.text}`}
			/>
		</View>
		{setOpenAddMenu && (
			<TouchableOpacity
				onPress={() => setOpenAddMenu(true)}
				style={styles.addButton}>
				<KText fontSize={24} text={'+'} />
			</TouchableOpacity>
		)}
	</View>
)

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	rowAlignText: {
		alignSelf: 'center',
	},
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		height: hp(50),
	},
	totalRowInside: {
		flexDirection: 'row',
		marginLeft: 0,
		marginRight: 'auto',
	},
	addButton: {
		alignItems: 'center',
		borderRadius: hp(25),
		borderWidth: 1,
		height: hp(50),
		justifyContent: 'center',
		marginLeft: 'auto',
		marginRight: 0,
		width: hp(50),
	},
})

export default TotalSegment
