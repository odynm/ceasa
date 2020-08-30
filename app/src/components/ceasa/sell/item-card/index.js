import React from 'react'
import { wp, hp } from 'src/utils/screen'
import { translate } from 'src/i18n/translate'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'
import MoneyService from 'src/services/moneyService'

const ItemCard = ({
	total,
	amount,
	product,
	unitPrice,
	handlePress,
	productType,
	description,
}) => {
	return (
		<TouchableWithoutFeedback onPress={handlePress}>
			<View style={styles.container}>
				<View style={styles.row}>
					<KText bold text={`${product} ${productType}`} />
				</View>
				{description && description.length > 0 ? (
					<View style={styles.row}>
						<KText text={description} />
					</View>
				) : (
					undefined
				)}
				<View style={styles.row}>
					<KText
						style={styles.itemLabel}
						fontSize={14}
						text={`${translate('sell.unitPrice')} `}
					/>
					<KText
						bold
						text={`${MoneyService.getCurrency().text} ${unitPrice.text} `}
					/>
					<KText
						style={styles.itemLabel}
						fontSize={14}
						text={`${translate('sell.amount')}`}
					/>
					<KText bold text={`${amount}`} />

					<View style={styles.alignRight}>
						<KText
							style={styles.itemLabel}
							fontSize={14}
							text={`${translate('sell.total')}`}
						/>
						<KText
							bold
							text={`${MoneyService.getCurrency().text} ${total.text}`}
						/>
					</View>
				</View>
			</View>
		</TouchableWithoutFeedback>
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
})

export default ItemCard