import React from 'react'
import { hp } from 'src/utils/screen'
import { translate } from 'src/i18n/translate'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import KModal from 'src/components/fw/kmodal'
import StoredItemCard from 'src/components/ceasa/stored-item-card'

const ProductSelect = ({ onClose, open, items, selectProduct }) => {
	return (
		<KModal
			big
			open={open}
			onClose={onClose}
			header={translate('sell.inStock')}>
			<ScrollView
				style={styles.scrollView}
				onStartShouldSetResponder={() => true}>
				<View onStartShouldSetResponder={() => true}>
					{items.map((item, index) => (
						<TouchableOpacity onPress={() => selectProduct(item)}>
							<StoredItemCard
								key={index}
								product={item.productName}
								productType={item.productTypeName}
								description={item.description}
								amount={item.amount}
							/>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		</KModal>
	)
}

const styles = StyleSheet.create({
	scrollView: {
		marginBottom: hp(30),
	},
})

export default ProductSelect
