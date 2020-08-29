import React from 'react'
import { hp, wp } from 'src/utils/screen'
import { translate } from 'src/i18n/translate'
import { View, StyleSheet } from 'react-native'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'

const ItemCard = ({ amount, product, productType, description }) => {
	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<KText bold text={`${product} ${productType}`} />
				<View style={styles.alignRight}>
					<KText
						fontSize={14}
						style={styles.itemLabel}
						text={`${translate('sell.amount')}`}
					/>
					<KText bold text={`${amount}`} />
				</View>
			</View>
			{description && description.length > 0 ? (
				<View style={styles.row}>
					<KText text={description} />
				</View>
			) : (
				undefined
			)}
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
	alignRight: {
		flexDirection: 'row',
		marginLeft: 'auto',
		marginRight: 0,
	},
	row: {
		flexDirection: 'row',
	},
	itemLabel: {
		lineHeight: hp(25),
	},
})

export default ItemCard
