import React from 'react'
import {hp} from 'src/utils/screen'
import {translate} from 'src/i18n/translate'
import {View, StyleSheet} from 'react-native'
import KText from 'src/components/fw/ktext'

const ClientSegment = ({client}) => {
    return (
        <View style={styles.client}>
            <KText
                fontSize={14}
                text={translate('loaderOrderInfo.clientKey')}
            />
            <KText bold fontSize={18} text={client.key} />
            <KText
                fontSize={14}
                text={translate('loaderOrderInfo.clientPlace')}
            />
            <KText bold fontSize={18} text={client.place} />
            <KText
                fontSize={14}
                text={translate('loaderOrderInfo.clientVehicle')}
            />
            <KText bold fontSize={18} text={client.vehicle} />
        </View>
    )
}

const styles = StyleSheet.create({
    client: {
        marginTop: hp(10),
    },
})

export default ClientSegment
