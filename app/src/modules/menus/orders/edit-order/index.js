import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as EditOrderCreators } from 'src/ducks/order/edit-order'
import styles from './styles'
import orderStatus from 'src/enums/order'
import screens from 'src/constants/screens'
import Space from 'src/components/fw/space'
import KText from 'src/components/fw/ktext'
import Loader from 'src/components/fw/loader'
import Button from 'src/components/fw/button'
import ScreenBase from 'src/components/fw/screen-base'
import CheckBox from '@react-native-community/checkbox'
import ScreenHeader from 'src/components/fw/screen-header'
import ClientSegment from 'src/components/ceasa/sell/client-segment'

const EditOrder = ({
	client,
	status,
	urgent,
	working,
	released,
	setClient,
	setUrgent,
	navigation,
	setReleased,
}) => {
	const handleDelete = () => {}

	const handleEditProducts = () => {
		navigation.navigate(screens.editProductsOrder)
	}

	return (
		<ScreenBase
			useScroll={false}
			useKeyboardAvoid={false}
			useKeyboardClose={false}>
			{status === orderStatus.blocked && (
				<View>
					{/* <Button
						onPress={handleDelete}
						style={styles.redButtonView}
						textStyle={styles.redButtonText}
						label={translate('editOrder.delete')}
					/> */}
					<View style={styles.strip}>
						<KText
							bold
							style={styles.blocked}
							text={translate('orders.blocked')}
						/>
					</View>
				</View>
			)}
			<View style={styles.client}>
				<ClientSegment client={client} setClient={setClient} />
			</View>
			<Button
				small
				onPress={handleEditProducts}
				style={styles.editProductView}
				label={translate('editOrder.editProducts')}
			/>
			<View style={styles.footer}>
				{status === orderStatus.blocked && (
					<View style={styles.row}>
						<KText
							bold
							style={styles.rowAlignText}
							text={translate('editOrder.released')}
						/>
						<CheckBox
							value={released}
							style={styles.checkbox}
							onValueChange={checked => setReleased(checked)}
						/>
					</View>
				)}
				<View style={styles.row}>
					<KText
						bold
						style={styles.rowAlignText}
						text={translate('editOrder.urgent')}
					/>
					<CheckBox
						value={urgent}
						style={styles.checkbox}
						onValueChange={checked => setUrgent(checked)}
					/>
				</View>
				<Space size2 />
				{working ? (
					<Loader />
				) : (
					<Button label={translate('editOrder.edit')} onPress={() => {}} />
				)}
			</View>
		</ScreenBase>
	)
}

EditOrder.navigationOptions = () => ({
	title: translate('menus.editOrder'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapDispatchToProps = {
	setClient: EditOrderCreators.setClient,
	setUrgent: EditOrderCreators.setUrgent,
	setReleased: EditOrderCreators.setReleased,
}

const mapStateToProps = ({ editOrder }) => ({
	status: editOrder.status,
	client: editOrder.client,
	urgent: editOrder.urgent,
	released: editOrder.released,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(EditOrder))
