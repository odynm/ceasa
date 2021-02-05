import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ScrollView } from 'react-native'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as AdditionalCostCreators } from 'src/ducks/additional-cost'
import AdditionalCostCard from './card'
import Space from 'src/components/fw/space'
import Loader from 'src/components/fw/loader'
import Button from 'src/components/fw/button'
import MoneyService from 'src/services/moneyService'
import TextInput from 'src/components/fw/text-input'
import ScreenBase from 'src/components/fw/screen-base'
import MoneyInput from 'src/components/fw/money-input'
import ScreenHeader from 'src/components/fw/screen-header'
import ConfirmationModal from 'src/components/fw/confirmation-modal'

const AdditionalCost = ({
	loading,
	additionalCosts,
	addAdditionalCost,
	loadAdditionalCosts,
	deleteAdditionalCost,
}) => {
	const [description, setDescription] = useState('')
	const [value, setValue] = useState('0,00')
	const [errors, setErrors] = useState({})
	const [idItemToBeDeleted, setIdItemToBeDeleted] = useState(0)
	const [deleteModalOpen, setDeleteModalOpen] = useState(false)

	useEffect(() => {
		loadAdditionalCosts()
	}, [])

	const addCost = async () => {
		const money = MoneyService.textToMoney(value)

		if (money.value <= 0) {
			setErrors({ value: translate('additionalCost.errors.value') })
			return
		}

		const success = await addAdditionalCost(description, money)

		if (success) {
			await loadAdditionalCosts()
			setDescription('')
			setValue('0,00')
			setErrors({})
		}
	}

	const askConfirmDelete = id => {
		setIdItemToBeDeleted(id)
		setDeleteModalOpen(true)
	}

	const handleDelete = async () => {
		await deleteAdditionalCost(idItemToBeDeleted)
		await loadAdditionalCosts()
	}

	return (
		<>
			<ScreenBase
				useScroll={false}
				useKeyboardAvoid={false}
				useKeyboardClose={false}>
				<TextInput
					value={description}
					maxLength={30}
					setValue={setDescription}
					errorMessage={errors.description}
					label={translate('additionalCost.description')}
				/>
				<MoneyInput
					value={value}
					setValue={setValue}
					errorMessage={errors.value}
					label={translate('additionalCost.value')}
				/>
				<Space />
				<>
					{loading ? (
						<Loader />
					) : (
						<Button
							small
							label={translate('additionalCost.add')}
							onPress={addCost}
						/>
					)}
				</>
				<Space />
				<ScrollView>
					{additionalCosts.map((cost, index) => (
						<AdditionalCostCard
							key={index}
							id={cost.id}
							costValue={cost.costValue}
							createdAt={cost.createdAt}
							description={cost.description}
							handlePress={askConfirmDelete}
						/>
					))}
				</ScrollView>
				<Space size4 />
			</ScreenBase>
			<ConfirmationModal
				open={deleteModalOpen}
				onAccept={handleDelete}
				onClose={() => setDeleteModalOpen(false)}
				header={translate('additionalCost.modalDelete.header')}
				content={translate('additionalCost.modalDelete.content')}
			/>
		</>
	)
}

AdditionalCost.navigationOptions = () => ({
	title: translate('menus.additionalCost'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapDispatchToProps = {
	addAdditionalCost: AdditionalCostCreators.addAdditionalCost,
	loadAdditionalCosts: AdditionalCostCreators.loadAdditionalCosts,
	deleteAdditionalCost: AdditionalCostCreators.deleteAdditionalCost,
}

const mapStateToProps = ({ additionalCost }) => ({
	loading: additionalCost.loading,
	additionalCosts: additionalCost.additionalCosts,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(AdditionalCost))
