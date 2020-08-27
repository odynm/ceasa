import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { View, ScrollView } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Creators as TeamCreators } from 'src/ducks/team'
import styles from './styles'
import screens from 'src/constants/screens'
import Space from 'src/components/fw/space'
import KText from 'src/components/fw/ktext'
import Loader from 'src/components/fw/loader'
import Button from 'src/components/fw/button'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'

const LoaderTeams = ({
	loader,
	navigation,
	loaderTeams,
	teamsLoading,
	loadLoaderTeams,
}) => {
	useEffect(() => {
		loadLoaderTeams()
	}, [])

	useEffect(() => {
		console.warn(loaderTeams)
	}, [loaderTeams])

	return (
		<>
			{teamsLoading ? (
				<Loader fullScreen />
			) : (
				<ScreenBase>
					<View style={styles.rowSpaceAround}>
						<Button
							tiny
							style={styles.editButton}
							//onPress={handleCreate}
							label={translate('loaderTeams.edit')}
						/>
						<Button
							tiny
							style={styles.editButton}
							//onPress={handleCreate}
							label={translate('loaderTeams.logout')}
						/>
					</View>
					<Space />
					<View style={styles.row}>
						<KText
							fontSize={22}
							text={`${translate('loaderTeams.loggedAs')}: `}
						/>
						<KText bold fontSize={22} text={loader.name} />
					</View>
					{loaderTeams && loaderTeams.length > 0 ? (
						<ScrollView>
							<View />
						</ScrollView>
					) : (
						<KText text={translate('loaderTeams.none')} />
					)}
					<Button
						style={styles.button}
						onPress={() => navigation.navigate(screens.readQr)}
						label={translate('loaderTeams.read')}
					/>
				</ScreenBase>
			)}
		</>
	)
}

LoaderTeams.navigationOptions = () => ({
	title: translate('loaderLogin.login'),
	headerLeft: props => <ScreenHeader noBack {...props} />,
})

const mapStateToProps = ({ team, loader }) => ({
	loader: loader.loader,
	teamsLoading: team.loading,
	loaderTeams: team.loaderTeams,
})

const mapDispatchToProps = {
	loadLoaderTeams: TeamCreators.loadLoaderTeams,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(LoaderTeams))
