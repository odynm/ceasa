import React from 'react'
import { wp, hp } from 'src/utils/screen'
import { translate } from 'src/i18n/translate'
import { View, StyleSheet } from 'react-native'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'

const ItemCard = ({ product, productType, description, amount }) => {
	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<KText bold text={`${product} ${productType}`} />
			</View>
			{description && description.length > 0 && (
				<View style={styles.row}>
					<View style={styles.alignRight}>
						<KText text={description} />
					</View>
				</View>
			)}
			<View style={styles.row}>
				<KText text={`${translate('sell.unitPrice')} ${'R$ 100,00'} `} />
				<KText text={`${translate('sell.amount')} ${20}`} />

				<View style={styles.alignRight}>
					<KText text={`${translate('sell.total')} ${'R$ 8.000,00'}`} />
				</View>
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
	row: {
		flexDirection: 'row',
	},
	alignRight: {
		flexDirection: 'row',
		marginLeft: 'auto',
		marginRight: 0,
	},
})

export default ItemCard
