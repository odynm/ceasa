import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { View, ScrollView } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Creators as EditStorageCreators } from 'src/ducks/storage/edit-storage'
import styles from './styles'
import screens from 'src/constants/screens'
import ToastService from 'src/services/toastService'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'
import StoredItemCard from 'src/components/ceasa/stored-item-card'

const ListMergedStorage = ({
	orderItems,
	navigation,
	noConnection,
	setStorageItemEdit,
}) => {
	const [mergedStorageItems, setMergedStorageItems] = useState([])
	const [itemDetails, setItemDetails] = useState('')

	useEffect(() => {
		if (navigation.state) {
			if (navigation.state?.params?.mergedStorageItems) {
				setMergedStorageItems(navigation.state.params.mergedStorageItems)
				setItemDetails(navigation.state.params.item)
			}
		}
	}, [navigation])

	const handleEdit = id => {
		if (noConnection) {
			ToastService.show({ message: translate('app.noConnectionError') })
		} else {
			if (orderItems && orderItems.length > 0) {
				ToastService.show({ message: translate('storage.errors.cantEdit') })
			} else {
				const storedItem = mergedStorageItems.find(x => x.id === id)
				setStorageItemEdit({
					...storedItem,
					productName: itemDetails.productName,
					productTypeName: itemDetails.productTypeName,
					description: itemDetails.description,
					productId: itemDetails.productId,
					productTypeId: itemDetails.productTypeId,
				})
				navigation.navigate(screens.editStorage)
			}
		}
	}

	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			<View style={styles.storedContainer}>
				<ScrollView
					style={styles.stored}
					persistentScrollbar={true}
					showsVerticalScrollIndicator={true}>
					{mergedStorageItems && mergedStorageItems.length > 0
						? mergedStorageItems.map((item, index) => {
								return (
									<StoredItemCard
										key={index}
										amount={item.amount}
										product={itemDetails.productName}
										description={itemDetails.description}
										productType={itemDetails.productTypeName}
										costPrice={item.costPrice}
										onPress={() => {
											handleEdit(item.id)
										}}
									/>
								)
						  })
						: null}
				</ScrollView>
			</View>
		</ScreenBase>
	)
}

ListMergedStorage.navigationOptions = () => ({
	title: translate('menus.storage'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapDispatchToProps = {
	setStorageItemEdit: EditStorageCreators.setStorageItem,
}

const mapStateToProps = ({ order, app }) => ({
	orderItems: order.orderItems,
	noConnection: app.noConnection,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(ListMergedStorage))
