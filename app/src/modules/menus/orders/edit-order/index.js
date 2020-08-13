import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { Creators as EditOrderCreators } from 'src/ducks/order/edit-order'
import styles from './styles'
import orderStatus from 'src/enums/order'
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
	working,
	released,
	setClient,
	setReleased,
}) => {
	const handleDelete = () => {}

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
				onPress={handleDelete}
				style={styles.editProductView}
				label={translate('editOrder.editProducts')}
			/>
			<View style={styles.footer}>
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
	setReleased: EditOrderCreators.setReleased,
}

const mapStateToProps = ({ editOrder }) => ({
	status: editOrder.status,
	client: editOrder.client,
	released: editOrder.released,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(EditOrder)
