import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { ScrollView, View } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Creators as HomeCreators } from 'src/ducks/home'
import ScreenHeader from 'src/components/fw/screen-header'
import styles from './styles'
import ItemCardHome from './item-card-home'

const Home = ({ overview, loadHome }) => {
	useEffect(() => {
		loadHome()
	}, [])

	return (
		<ScrollView style={styles.container}>
			{overview && overview.length > 0
				? overview.map(item => (
						<View key={item.id}>
							<ItemCardHome
								sold={item.sold}
								amount={item.amount}
								product={item.productName}
								costPrice={item.costPrice}
								description={item.description}
								totalEarned={item.totalEarned}
								liquidEarned={item.liquidEarned}
								productType={item.productTypeName}
								startingTotalItems={item.startingTotalItems}
							/>
						</View>
				  ))
				: undefined}
		</ScrollView>
	)
}

Home.navigationOptions = () => ({
	title: translate('menus.home'),
	headerLeft: props => <ScreenHeader noBack {...props} />,
})

const mapDispatchToProps = {
	loadHome: HomeCreators.loadHome,
}

const mapStateToProps = ({ home }) => ({
	overview: home.overview,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(Home))
