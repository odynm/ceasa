import React, { useState } from 'react'
import { translate } from 'src/i18n/translate'
import { ScrollView, StyleSheet } from 'react-native'
import { Selectors as StorageSelectors } from 'src/ducks/storage'
import PriceSelect from '../price-select'
import KText from 'src/components/fw/ktext'
import ToastService from 'src/services/toastService'
import ItemCard from 'src/components/ceasa/sell/item-card'

const ProductListSegment = ({
	style,
	editMode,
	cantEdit,
	orderItems,
	editProduct,
	storageItems,
	removeProduct,
}) => {
	const [product, setProduct] = useState({})
	const [modalOpen, setModalOpen] = useState(false)

	const handlePress = item => {
		if (cantEdit) {
			ToastService.show({
				message: translate('orders.errors.cantEditAnymore'),
			})
		} else {
			setProduct(item)
			setModalOpen(true)
		}
	}

	return (
		<>
			<ScrollView style={style}>
				{orderItems && orderItems.length > 0 ? (
					orderItems.map((item, index) => (
						<ItemCard
							key={index}
							total={item.total}
							amount={item.amount}
							unitPrice={item.unitPrice}
							product={item.productName}
							description={item.description}
							productType={item.productTypeName}
							handlePress={() => handlePress(item)}
						/>
					))
				) : (
					<KText
						style={styles.centerText}
						text={translate('sell.noItemsAdded')}
					/>
				)}
			</ScrollView>
			<PriceSelect
				edit
				open={modalOpen}
				addProduct={editProduct}
				removeProduct={removeProduct}
				selectedProduct={product}
				onClose={() => setModalOpen(false)}
				initialValues={{
					amount: product.amount,
					price: product.unitPrice,
				}}
				available={StorageSelectors.getAvailable({
					storageItems: storageItems,
					id: product.storageId,
				})}
			/>
		</>
	)
}

const styles = StyleSheet.create({})

export default ProductListSegment
