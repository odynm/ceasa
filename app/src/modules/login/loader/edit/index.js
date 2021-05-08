import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {translate} from 'src/i18n/translate'
import {withNavigation} from 'react-navigation'
import {Creators as LoaderCreators} from 'src/ducks/loader'
import styles from './styles'
import Loader from 'src/components/fw/loader'
import Button from 'src/components/fw/button'
import TextInput from 'src/components/fw/text-input'
import ScreenBase from 'src/components/fw/screen-base'
import ScreenHeader from 'src/components/fw/screen-header'

const LoaderEdit = ({login, create, navigation}) => {
    const [loading, setLoading] = useState(false)
    const [nameInput, setNameInput] = useState('')
    const [nameError, setNameError] = useState('')

    useEffect(() => {
        if (navigation.state?.params?.name) {
            setNameInput(navigation.state.params.name)
        }
    }, [])

    const handleEdit = async () => {
        setLoading(true)
        setNameError('')
        if (nameInput.length > 2) {
            await create(nameInput)
            await login()
            navigation.goBack()
        } else {
            setNameError(translate('loaderLogin.nameRequired'))
        }
        setLoading(false)
    }

    return (
        <>
            {loading ? (
                <Loader fullScreen />
            ) : (
                <ScreenBase>
                    <TextInput
                        value={nameInput}
                        maxLength={50}
                        setValue={setNameInput}
                        errorMessage={nameError}
                        label={translate('loaderEdit.name')}
                    />
                    <Button
                        style={styles.button}
                        onPress={handleEdit}
                        label={translate('loaderEdit.editButton')}
                    />
                </ScreenBase>
            )}
        </>
    )
}

LoaderEdit.navigationOptions = () => ({
    title: translate('loaderEdit.title'),
    headerLeft: (props) => <ScreenHeader {...props} />,
})

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {
    login: LoaderCreators.login,
    create: LoaderCreators.create,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withNavigation(LoaderEdit))
