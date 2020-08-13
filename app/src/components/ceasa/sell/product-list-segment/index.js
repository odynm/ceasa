import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import KText from 'src/components/fw/ktext'
import ItemCard from 'src/components/ceasa/sell/item-card'
import { translate } from 'src/i18n/translate'

const ProductListSegment = ({ orderItems, style }) => (
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
				/>
			))
		) : (
			<KText
				style={styles.centerText}
				text={translate('sell.noItemsAdded')}
			/>
		)}
	</ScrollView>
)

const styles = StyleSheet.create({})

export default ProductListSegment
