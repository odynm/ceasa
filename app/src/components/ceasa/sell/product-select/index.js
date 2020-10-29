import React from 'react'
import { translate } from 'src/i18n/translate'
import { View, ScrollView, StyleSheet } from 'react-native'
import KText from 'src/components/fw/ktext'
import KModal from 'src/components/fw/kmodal'
import StoredItemCard from 'src/components/ceasa/stored-item-card'

const ProductSelect = ({
	open,
	onClose,
	storageItems,
	selectProduct,
	alreadyAddedProducts,
}) => {
	return (
		<KModal open={open} onClose={onClose} header={translate('sell.inStock')}>
			<ScrollView onStartShouldSetResponder={() => true}>
				<View onStartShouldSetResponder={() => true}>
					{storageItems && storageItems.length > 0 ? (
						storageItems
							.filter(x =>
								alreadyAddedProducts && alreadyAddedProducts.length > 0
									? alreadyAddedProducts.every(y => y.id !== x.id)
									: true,
							)
							.map((item, index) => (
								<StoredItemCard
									key={index}
									amount={item.amount}
									product={item.productName}
									description={item.description}
									productType={item.productTypeName}
									onPress={() => selectProduct(item)}
								/>
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
