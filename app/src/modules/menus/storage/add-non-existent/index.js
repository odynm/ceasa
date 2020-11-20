import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as ProductCreators } from 'src/ducks/products'
import styles from './styles'
import KText from 'src/components/fw/ktext'
import Space from 'src/components/fw/space'
import Button from 'src/components/fw/button'
import Loader from 'src/components/fw/loader'
import TextInput from 'src/components/fw/text-input'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'
import RecentRegisterPicker from 'src/components/fw/pickers/recent-register-picker'

const AddNonExistent = ({
	products,
	navigation,
	addNewType,
	loadProducts,
	addNewProduct,
}) => {
	const [loading, setLoading] = useState(false)
	const [isType, setIsType] = useState(true)
	const [errors, setErrors] = useState({})
	const [selectedId, setSelectedId] = useState(0)
	const [description, setDescription] = useState('')

	useEffect(() => {
		if (navigation.state?.params?.nonExistentType) {
			setIsType(navigation.state.params.nonExistentType === 'type')
		}
	}, [navigation])

	const addNonExistent = async () => {
		const error = {}
		if (!description || description.length <= 2) {
			error.description = translate('addNonExistent.errors.description')
		}
		if (isType) {
			if (!selectedId) {
				error.relatedProduct = translate(
					'addNonExistent.errors.relatedProduct',
				)
			}
		}
		if (error.description || error.relatedProduct) {
			setErrors(error)
		} else {
			setLoading(true)
			if (isType) {
				await addNewType(description, selectedId)
			} else {
				await addNewProduct(description)
			}

			await loadProducts()
			setLoading(false)
			navigation.goBack(null)
		}
	}

	return (
		<ScreenBase
			useScroll={false}
			useKeyboardClose={true}
			useKeyboardAvoid={false}>
			<KText
				bold
				fontSize={19}
				text={
					isType
						? translate('addNonExistent.addType')
						: translate('addNonExistent.addProduct')
				}
			/>
			<Space />
			<TextInput
				value={description}
				editable={!loading}
				errorMessage={errors && errors.description}
				label={translate('addNonExistent.description')}
				setValue={value => {
					setErrors({ ...errors, description: undefined })
					setDescription(value)
				}}
			/>
			{isType && (
				<RecentRegisterPicker
					disabled={loading}
					selectedId={selectedId}
					list={products}
					setSelectedId={id => {
						setErrors({ ...errors, relatedProduct: undefined })
						setSelectedId(id)
					}}
					label={translate('addNonExistent.relatedProduct')}
					listLabel={translate('addNonExistent.relatedProduct')}
				/>
			)}
			<View style={styles.button}>
				{loading ? (
					<Loader />
				) : (
					<Button
						onPress={() => {
							addNonExistent()
						}}
						label={translate('addNonExistent.add')}
					/>
				)}
			</View>
		</ScreenBase>
	)
}

AddNonExistent.navigationOptions = () => ({
	title: translate('menus.addNonExistent'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapDispatchToProps = {
	addNewType: ProductCreators.addNewType,
	loadProducts: ProductCreators.loadProducts,
	addNewProduct: ProductCreators.addNewProduct,
}

const mapStateToProps = ({ products }) => ({
	products: products.products,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(AddNonExistent))
