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
	const [initialValues, setInitialValues] = useState({})
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
			// This was done to avoid refreshing the initial values when the
			// storage changed
			setInitialValues({
				amount: item.amount,
				price: item.unitPrice,
			})
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
				initialValues={initialValues}
				onClose={() => setModalOpen(false)}
				available={StorageSelectors.getAvailable({
					storageItems: storageItems,
					product: product,
				})}
			/>
		</>
	)
}

const styles = StyleSheet.create({})

export default ProductListSegment
