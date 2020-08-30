import React, { useState } from 'react'
import { translate } from 'src/i18n/translate'
import { ScrollView, StyleSheet } from 'react-native'
import PriceSelect from '../price-select'
import KText from 'src/components/fw/ktext'
import ItemCard from 'src/components/ceasa/sell/item-card'

const ProductListSegment = ({ style, orderItems, editProduct }) => {
	const [product, setProduct] = useState({})
	const [modalOpen, setModalOpen] = useState(false)

	const handlePress = item => {
		setProduct(item)
		setModalOpen(true)
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
				selectedProduct={product}
				onClose={() => setModalOpen(false)}
				initialValues={{
					amount: product.amount,
					price: product.unitPrice,
				}}
			/>
		</>
	)
}

const styles = StyleSheet.create({})

export default ProductListSegment