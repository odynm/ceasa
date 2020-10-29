import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { ScrollView, View } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Creators as HomeCreators } from 'src/ducks/home'
import styles from './styles'
import KText from 'src/components/fw/ktext'
import ItemCardHome from './item-card-home'
import Loader from 'src/components/fw/loader'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'

const Home = ({ overview, loadHome, loading }) => {
	useEffect(() => {
		loadHome()
	}, [])

	return (
		<>
			{loading && (!overview || overview.length === 0) ? (
				<Loader fullScreen />
			) : (
				<ScreenBase
					useScroll={false}
					useKeyboardAvoid={false}
					useKeyboardClose={false}>
					<ScrollView style={styles.container}>
						{overview && overview.length > 0 ? (
							overview.map(item => (
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
						) : (
							<KText text={translate('home.empty')} />
						)}
					</ScrollView>
				</ScreenBase>
			)}
		</>
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
	loading: home.loading,
	overview: home.overview,
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(Home))
