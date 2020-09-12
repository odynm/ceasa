import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as AppCreators } from 'src/ducks/app'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as EditStorageCreators } from 'src/ducks/storage/edit-storage'
import styles from './styles'
import screens from 'src/constants/screens'
import Space from 'src/components/fw/space'
import Amount from 'src/components/fw/amount'
import Button from 'src/components/fw/button'
import TextInput from 'src/components/fw/text-input'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'

const EditStorage = ({
	add,
	setAmount,
	deleteItem,
	navigation,
	storageItem,
	setAppLoader,
	setDescription,
}) => {
	const handleDelete = async () => {
		setAppLoader(true)
		await deleteItem(storageItem)
		setAppLoader(false)
		navigation.navigate(screens.storage)
	}

	const handleEdit = async () => {
		setAppLoader(true)
		await add(storageItem)
		setAppLoader(false)
		navigation.navigate(screens.storage)
	}

	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			<Button
				tiny
				onPress={handleDelete}
				style={styles.redButtonView}
				textStyle={styles.redButtonText}
				label={translate('editStorage.delete')}
			/>
			<TextInput
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
			<Button onPress={handleEdit} label={translate('editStorage.edit')} />
		</ScreenBase>
	)
}

EditStorage.navigationOptions = () => ({
	title: translate('menus.editStorage'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapDispatchToProps = {
	add: StorageCreators.add,
	delete: StorageCreators.delete,
	setAppLoader: AppCreators.setAppLoader,
	setAmount: EditStorageCreators.setAmount,
	setDescription: EditStorageCreators.setDescription,
	setStorageItem: EditStorageCreators.setStorageItem,
}

const mapStateToProps = ({ editStorage }) => ({
	storageItem: editStorage.storageItem,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(EditStorage))
