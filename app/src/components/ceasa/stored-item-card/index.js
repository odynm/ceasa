import React from 'react'
import { wp, hp } from 'src/utils/screen'
import { translate } from 'src/i18n/translate'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'

const StoredItemCard = ({
	amount,
	product,
	onPress,
	isMerged,
	costPrice,
	productType,
	description,
}) => {
	return (
		<>
			{amount > 0 ? (
				<TouchableOpacity onPress={onPress}>
					<View style={styles.container}>
						<View style={styles.row}>
							<KText bold text={`${product} ${productType}`} />
							<KText bold style={styles.amount} text={amount} />
						</View>
						<KText text={description} />
						{costPrice.value > 0 ? (
							isMerged ? (
								<View style={styles.row}>
									<KText
										text={`${translate('storage.costPriceMerged')}: `}
									/>
									<KText text={costPrice.text} />
								</View>
							) : (
								<View style={styles.row}>
									<KText
										text={`${translate('storage.costPriceShort')}: `}
									/>
									<KText text={costPrice.text} />
								</View>
							)
						) : (
							undefined
						)}
					</View>
				</TouchableOpacity>
			) : (
				undefined
			)}
		</>
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
