import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { hp, wp } from 'src/utils/screen'
import { translate } from 'src/i18n/translate'
import { withNavigation } from 'react-navigation'
import { Creators as TeamCreators } from 'src/ducks/team'
import { StyleSheet, View, ScrollView } from 'react-native'
import TeamCard from './card'
import screens from 'src/constants/screens'
import KText from 'src/components/fw/ktext'
import Space from 'src/components/fw/space'
import Button from 'src/components/fw/button'
import Loader from 'src/components/fw/loader'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'
import ConfirmationModal from 'src/components/fw/confirmation-modal'

const LoadersTeam = ({
	loading,
	navigation,
	deleteTeam,
	vendorTeams,
	loadVendorTeams,
}) => {
	const [modalAcceptDelete, setModalAcceptDelete] = useState(false)
	const [selectedId, setSelectedId] = useState(0)
	const [selectedName, setSelectedName] = useState('')

	useEffect(() => {
		loadVendorTeams()
	}, [])

	const handleDelete = async () => {
		await deleteTeam(selectedId)
		await loadVendorTeams()
	}

	return (
		<>
			<ScreenBase
				useScroll={false}
				useKeyboardAvoid={false}
				useKeyboardClose={false}>
				<View style={styles.container}>
					{loading ? (
						<Loader />
					) : (
						<ScrollView style={styles.scrollView}>
							{vendorTeams && vendorTeams.length > 0 ? (
								vendorTeams.map(item => (
									<View key={item.id}>
										<TeamCard
											name={item.loaderName}
											onDelete={() => {
												setSelectedId(item.id)
												setSelectedName(item.loaderName)
												setModalAcceptDelete(true)
											}}
										/>
										<Space />
									</View>
								))
							) : (
								<KText text={translate('user.loadersTeam.noLoaders')} />
							)}
						</ScrollView>
					)}
					<Space size2 />
					<View style={styles.footer}>
						<Button
							onPress={() => {
								navigation.navigate(screens.addLoader)
							}}
							label={translate('user.addLoader.title')}
						/>
					</View>
				</View>
			</ScreenBase>
			<ConfirmationModal
				open={modalAcceptDelete}
				onAccept={handleDelete}
				onClose={() => setModalAcceptDelete(false)}
				header={translate('user.loadersTeam.modalDelete.header')}
				content={translate('user.loadersTeam.modalDelete.content').replace(
					'{0}',
					selectedName,
				)}
			/>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flex: 1,
	},
	scrollView: {
		width: wp(300),
	},
	footer: {
		marginBottom: hp(50),
		marginTop: 'auto',
	},
})

LoadersTeam.navigationOptions = () => ({
	title: translate('user.loadersTeam.title'),
	headerLeft: props => <ScreenHeader {...props} />,
})

const mapStateToProps = ({ team }) => ({
	loading: team.loading,
	vendorTeams: team.vendorTeams,
})

const mapDispatchToProps = {
	deleteTeam: TeamCreators.deleteTeam,
	loadVendorTeams: TeamCreators.loadVendorTeams,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(LoadersTeam))
