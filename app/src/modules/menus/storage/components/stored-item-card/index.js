import React from 'react'
import { wp, hp } from 'src/utils/screen'
import { View, StyleSheet } from 'react-native'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'

const StoredItemCard = ({ product, productType, description, amount }) => {
	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<KText bold text={`${product} ${productType}`} />
				<KText bold style={styles.amount} text={amount} />
			</View>
			<KText bold text={description} />
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
	amount: {
		marginLeft: 'auto',
		marginRight: 0,
	},
})

export default StoredItemCard
