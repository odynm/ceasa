import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as AppCreators } from 'src/ducks/app'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as EditStorageCreators } from 'src/ducks/storage/edit-storage'
import styles from './styles'
import KText from 'src/components/fw/ktext'
import screens from 'src/constants/screens'
import Space from 'src/components/fw/space'
import Amount from 'src/components/fw/amount'
import Button from 'src/components/fw/button'
import ScreenHeaderDeleteStorage from './header'
import MoneyService from 'src/services/moneyService'
import TextInput from 'src/components/fw/text-input'
import ToastService from 'src/services/toastService'
import MoneyInput from 'src/components/fw/money-input'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'
import ConfirmationModal from 'src/components/fw/confirmation-modal'

const EditStorage = ({
	add,
	setAmount,
	deleteItem,
	navigation,
	loadStorage,
	storageItem,
	noConnection,
	setCostPrice,
	setAppLoader,
	confirmDelete,
	setDescription,
	setConfirmDelete,
}) => {
	const handleDelete = async () => {
		setAppLoader(true)
		const success = await deleteItem(storageItem)
		if (success) {
			await loadStorage()
		}
		setAppLoader(false)
		navigation.navigate(screens.storage)
	}

	const handleEdit = async () => {
		if (noConnection) {
			ToastService.show({ message: translate('app.noConnectionError') })
		} else {
			setAppLoader(true)
			await add(storageItem)
			setAppLoader(false)
			navigation.navigate(screens.storage)
		}
	}

	return (
		<>
			<ScreenBase
				useScroll={false}
				useKeyboardAvoid={false}
				useKeyboardClose={true}>
				<KText
					bold
					fontSize={24}
					text={`${storageItem.productName} ${
						storageItem.productTypeName
					}`}
				/>
				<Space />
				<TextInput
					maxLength={50}
					setValue={setDescription}
					value={storageItem.description}
					label={translate('storage.additionalDescription')}
				/>
				<Space />
				<Amount
					setValue={setAmount}
					value={storageItem.amount}
					label={translate('storage.amount')}
				/>
				<>
					<MoneyInput
						setValue={value => {
							setCostPrice(MoneyService.textToMoney(value))
						}}
						value={storageItem.costPrice.text}
						label={translate('storage.costPrice')}
					/>
				</>
				<Button
					onPress={handleEdit}
					style={styles.button}
					label={translate('editStorage.edit')}
				/>
			</ScreenBase>
			<ConfirmationModal
				open={confirmDelete}
				onAccept={handleDelete}
				onClose={() => setConfirmDelete(false)}
				header={translate('editStorage.deleteModal.header')}
				content={translate('editStorage.deleteModal.content')}
			/>
		</>
	)
}

EditStorage.navigationOptions = () => ({
	title: translate('menus.editStorage'),
	headerLeft: props => <ScreenHeader {...props} />,
	headerRight: props => <ScreenHeaderDeleteStorage {...props} />,
})

const mapDispatchToProps = {
	add: StorageCreators.add,
	loadStorage: StorageCreators.get,
	deleteItem: StorageCreators.deleteItem,
	setAppLoader: AppCreators.setAppLoader,
	setAmount: EditStorageCreators.setAmount,
	setCostPrice: EditStorageCreators.setCostPrice,
	setDescription: EditStorageCreators.setDescription,
	setStorageItem: EditStorageCreators.setStorageItem,
	setConfirmDelete: EditStorageCreators.setConfirmDelete,
}

const mapStateToProps = ({ app, editStorage }) => ({
	noConnection: app.noConnection,
	storageItem: editStorage.storageItem,
	confirmDelete: editStorage.confirmDelete,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(EditStorage))
