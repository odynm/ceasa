import React, {useState} from 'react'
import {connect} from 'react-redux'
import {translate} from 'src/i18n/translate'
import {withNavigation} from 'react-navigation'
import {Creators as TeamCreators} from 'src/ducks/team'
import styles from './styles'
import Loader from 'src/components/fw/loader'
import Button from 'src/components/fw/button'
import ToastService from 'src/services/toastService'
import TextInput from 'src/components/fw/text-input'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'

const WriteQr = ({navigation, joinTeam, loadLoaderTeams}) => {
    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState('')

    const handlePress = async () => {
        if (code && code.length > 1) {
            setLoading(true)
            await joinTeam(code)
            setLoading(false)

            await loadLoaderTeams()
            navigation.goBack(null)
        } else {
            ToastService.show({
                message: translate('loaderTeams.joinFail'),
                duration: 2000,
            })
        }
    }

    return (
        <>
            {loading ? (
                <Loader fullScreen />
            ) : (
                <ScreenBase>
                    <TextInput
                        maxLength={50}
                        value={code}
                        editable={true}
                        label={translate('loaderTeams.insertCode')}
                        setValue={(value) => {
                            setCode(value)
                        }}
                    />
                    <Button
                        small
                        style={styles.button}
                        onPress={handlePress}
                        label={translate('loaderTeams.joinTeamButton')}
                    />
                </ScreenBase>
            )}
        </>
    )
}

WriteQr.navigationOptions = () => ({
    title: translate('loaderMenus.join'),
    headerLeft: (props) => <ScreenHeader {...props} />,
})

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {
    joinTeam: TeamCreators.joinTeam,
    loadLoaderTeams: TeamCreators.loadLoaderTeams,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withNavigation(WriteQr))
