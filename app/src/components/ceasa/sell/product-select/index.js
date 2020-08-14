import React from 'react'
import { translate } from 'src/i18n/translate'
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import KText from 'src/components/fw/ktext'
import KModal from 'src/components/fw/kmodal'
import StoredItemCard from 'src/components/ceasa/stored-item-card'

const ProductSelect = ({ onClose, open, storageItems, selectProduct }) => {
	return (
		<KModal open={open} onClose={onClose} header={translate('sell.inStock')}>
			<ScrollView onStartShouldSetResponder={() => true}>
				<View onStartShouldSetResponder={() => true}>
					{storageItems && storageItems.length > 0 ? (
						storageItems.map((item, index) => (
							<TouchableOpacity
								key={index}
								onPress={() => selectProduct(item)}>
								<StoredItemCard
									amount={item.amount}
									product={item.productName}
									description={item.description}
									productType={item.productTypeName}
								/>
							</TouchableOpacity>
						))
					) : (
						<View>
							<KText
								style={styles.centerText}
								text={translate('sell.emptyStorage')}
							/>
						</View>
					)}
				</View>
			</ScrollView>
		</KModal>
	)
}

const styles = StyleSheet.create({
	centerText: {
		textAlign: 'center',
	},
})

export default ProductSelect
