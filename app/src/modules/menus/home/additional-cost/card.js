import React from 'react'
import { toHour } from 'src/utils/date'
import { wp, hp } from 'src/utils/screen'
import { translate } from 'src/i18n/translate'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'
import MoneyService from 'src/services/moneyService'

const AdditionalCostCard = ({
	id,
	costValue,
	createdAt,
	description,
	handlePress,
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<View style={styles.flex}>
					<View style={[styles.row, styles.flex]}>
						<KText
							bold
							text={`${MoneyService.getCurrency().text} ${
								costValue.text
							} `}
						/>
						<View style={styles.alignRight}>
							<KText
								style={styles.itemLabel}
								fontSize={14}
								text={toHour(createdAt)}
							/>
						</View>
					</View>
					<View style={styles.row}>
						<KText fontSize={16} text={description} />
					</View>
				</View>
				<TouchableOpacity
					onPress={() => {
						handlePress(id)
					}}
					style={styles.buttonContainer}>
					<View style={styles.buttonBox}>
						<KText text={translate('additionalCost.delete')} />
					</View>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		borderColor: colors.primary,
		borderRadius: wp(10),
		borderWidth: 1,
		marginVertical: hp(5),
		paddingHorizontal: wp(10),
		paddingVertical: hp(8),
	},
	flex: {
		flex: 1,
	},
	row: {
		flexDirection: 'row',
	},
	alignRight: {
		flexDirection: 'row',
		marginLeft: 'auto',
		marginRight: 0,
	},
	itemLabel: {
		lineHeight: hp(25),
	},
	buttonContainer: {
		alignContent: 'center',
		justifyContent: 'center',
		marginLeft: wp(5),
		width: wp(60),
	},
	buttonBox: {
		alignSelf: 'center',
		borderColor: colors.primary,
		borderRadius: wp(5),
		borderWidth: 1,
		paddingHorizontal: wp(5),
	},
})

export default AdditionalCostCard
