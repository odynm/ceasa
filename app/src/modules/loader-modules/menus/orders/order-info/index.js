import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { View, ScrollView } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Selectors as OrdersLoaderSelectors } from 'src/ducks/orders-loader'
import ItemCard from './card'
import styles from './styles'
import Space from 'src/components/fw/space'
import KText from 'src/components/fw/ktext'
import Loader from 'src/components/fw/loader'
import Button from 'src/components/fw/button'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'
import ClientSegment from 'src/components/ceasa/order/client-segment'

const LoaderOrderInfo = ({ order, navigation }) => {
	const startJob = () => {
		// TODO start job
		// TODO load jobs
		// TODO go to joblist screen
	}

	return (
		<>
			{order && order.id ? (
				<ScreenBase
					useScroll={false}
					useKeyboardAvoid={false}
					useKeyboardClose={false}>
					<ClientSegment client={order.client} />
					<Space />
					<KText text={translate('loaderOrderInfo.products')} />
					<ScrollView>
						{order.products.map((item, index) => (
							<ItemCard
								key={index}
								amount={item.amount}
								product={item.productName}
								description={item.description}
								productType={item.productTypeName}
							/>
						))}
					</ScrollView>
					<View style={styles.footer}>
						{false ? (
							<Loader />
						) : (
							<Button
								label={translate('loaderOrderInfo.begin')}
								onPress={startJob}
							/>
						)}
					</View>
				</ScreenBase>
			) : (
				<Loader fullScreen />
			)}
		</>
	)
}

LoaderOrderInfo.navigationOptions = () => ({
	title: translate('menus.editOrder'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapDispatchToProps = {}

const mapStateToProps = ({ ordersLoader }) => ({
	order: OrdersLoaderSelectors.getOrder(ordersLoader),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(LoaderOrderInfo))
