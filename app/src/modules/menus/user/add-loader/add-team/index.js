import React from 'react'
import {hp} from 'src/utils/screen'
import {translate} from 'src/i18n/translate'
import {StyleSheet, View} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import Loader from 'src/components/fw/loader'
import ScreenHeader from 'src/components/fw/screen-header'

const AddTeam = ({teamCode, loading}) => {
    return (
        <View style={styles.qrCodeBounds}>
            {loading ? (
                <Loader />
            ) : teamCode && teamCode.length > 0 ? (
                <QRCode value={teamCode} size={300} />
            ) : (
                undefined
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    qrCodeBounds: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginVertical: hp(20),
    },
})

AddTeam.navigationOptions = () => ({
    title: translate('menus.user'),
    headerLeft: (props) => <ScreenHeader noBack {...props} />,
})

export default AddTeam
