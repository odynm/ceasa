import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { View, ScrollView } from 'react-native'
import { withNavigation } from 'react-navigation'
import { loginType } from 'src/constants/login-type'
import { Creators as TeamCreators } from 'src/ducks/team'
import { Creators as LoaderCreators } from 'src/ducks/loader'
import styles from './styles'
import TeamCard from './card'
import stacks from 'src/constants/stacks'
import screens from 'src/constants/screens'
import Space from 'src/components/fw/space'
import KText from 'src/components/fw/ktext'
import Loader from 'src/components/fw/loader'
import Button from 'src/components/fw/button'
import ScreenBase from 'src/components/fw/screen-base'
import StorageService from 'src/services/storageService'
import ScreenHeader from 'src/components/fw/screen-header'

const LoaderTeams = ({
	loader,
	setLoader,
	setUserId,
	navigation,
	loaderTeams,
	teamsLoading,
	loadLoaderTeams,
}) => {
	useEffect(() => {
		StorageService.loginType.set(loginType.loader)
		loadLoaderTeams()
	}, [])

	const handleEdit = userId => {
		setUserId(userId)
		navigation.navigate(screens.loaderEdit, {
			name: loader.name,
		})
	}

	const handleSelect = userId => {
		setUserId(userId)
		navigation.navigate(stacks.loaderMenu)
	}

	return (
		<>
			{teamsLoading ? (
				<Loader fullScreen />
			) : (
				<ScreenBase useScroll={false}>
					<View style={styles.rowSpaceAround}>
						<Button
							tiny
							style={styles.editButton}
							label={translate('loaderTeams.edit')}
							onPress={() => {
								handleEdit()
							}}
						/>
						<Button
							tiny
							style={styles.editButton}
							label={translate('loaderTeams.logout')}
							onPress={() => {
								setLoader({})
								navigation.navigate(screens.loginSelect)
							}}
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
					<View style={styles.flex}>
						{loaderTeams && loaderTeams.length > 0 ? (
							<>
								<Space />
								<KText
									text={translate('loaderTeams.registeredTeams')}
								/>
								<Space />
								<ScrollView style={styles.scrollView}>
									{loaderTeams.map((x, i) => (
										<TeamCard
											key={i}
											style={styles.card}
											name={x.userName}
											onPress={() => handleSelect(x.userId)}
										/>
									))}
								</ScrollView>
							</>
						) : (
							<KText text={translate('loaderTeams.none')} />
						)}
					</View>
					<View style={styles.joinArea}>
						<KText bold text={`${translate('loaderTeams.joinTeam')}:`} />
						<Space />
						<Button
							onPress={() => navigation.navigate(screens.readQr)}
							label={translate('loaderTeams.read')}
						/>
						<Space />
						<Button
							onPress={() => navigation.navigate(screens.writeQr)}
							label={translate('loaderTeams.write')}
						/>
					</View>
				</ScreenBase>
			)}
		</>
	)
}

LoaderTeams.navigationOptions = () => ({
	title: translate('loaderMenus.loader'),
	headerLeft: props => <ScreenHeader noBack {...props} />,
})

const mapStateToProps = ({ team, loader }) => ({
	loader: loader.loader,
	teamsLoading: team.loading,
	loaderTeams: team.loaderTeams,
})

const mapDispatchToProps = {
	setLoader: LoaderCreators.setLoader,
	setUserId: LoaderCreators.setUserId,
	loadLoaderTeams: TeamCreators.loadLoaderTeams,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(LoaderTeams))
