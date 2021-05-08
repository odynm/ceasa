import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {hp} from 'src/utils/screen'
import {StyleSheet} from 'react-native'
import {translate} from 'src/i18n/translate'
import {Creators as AppCreators} from 'src/ducks/app'
import Button from 'src/components/fw/button'
import KModal from 'src/components/fw/kmodal'
import KText from 'src/components/fw/ktext'

const UnexpectedError = ({unexpectedError, setUnexpectedError}) => {
    useEffect(() => {}, [])

    return (
        <KModal
            size={250}
            style={styles.modal}
            open={unexpectedError}
            onClose={() => setUnexpectedError(false)}
            header={translate('app.error.unexpected')}>
            <KText text={translate('app.error.unexpectedText')} />
            <Button
                small
                style={styles.button}
                label={translate('app.ok')}
                onPress={() => setUnexpectedError(false)}
            />
        </KModal>
    )
}

const mapStateToProps = ({app}) => ({
    unexpectedError: app.unexpectedError,
})

const mapDispatchToProps = {
    setUnexpectedError: AppCreators.setUnexpectedError,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(UnexpectedError)

const styles = StyleSheet.create({
    modal: {
        marginTop: hp(200),
    },
    button: {
        marginTop: 'auto',
        marginBottom: hp(20),
    },
})
