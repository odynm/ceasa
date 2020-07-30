import React from 'react'
import { translate } from 'src/i18n/translate'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import KModal from 'src/components/fw/kmodal'
import StoredItemCard from 'src/components/ceasa/stored-item-card'

const ProductSelect = ({ onClose, open, items, selectProduct }) => {
	return (
		<KModal open={open} onClose={onClose} header={translate('sell.inStock')}>
			<ScrollView onStartShouldSetResponder={() => true}>
				<View onStartShouldSetResponder={() => true}>
					{items.map((item, index) => (
						<TouchableOpacity
							key={index}
							onPress={() => selectProduct(item)}>
							<StoredItemCard
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

export default ProductSelect
