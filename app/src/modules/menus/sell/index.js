import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { Creators as StorageCreators } from 'src/ducks/storage'
import { Creators as ProductCreators } from 'src/ducks/products'
import styles from './styles'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'
import AddProduct from './components/add-product'

const Sell = ({ getStorage, storedItems, loadProducts }) => {
	const [errors, setErrors] = useState({})

	useEffect(() => {
		loadProducts()
		getStorage()
	}, [])

	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			<AddProduct items={storedItems} />
		</ScreenBase>
	)
}

Sell.navigationOptions = () => ({
	title: translate('menus.sell'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapDispatchToProps = {
	getStorage: StorageCreators.get,
	loadProducts: ProductCreators.loadProducts,
}

const mapStateToProps = ({ products, storage }) => ({
	storedItems: storage.storedItems,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Sell)
