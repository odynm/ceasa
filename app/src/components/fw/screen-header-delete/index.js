import React from 'react'
import {wp, hp} from 'src/utils/screen'
import {translate} from 'src/i18n/translate'
import {withNavigation} from 'react-navigation'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import KText from '../ktext'
import colors from 'src/constants/colors'

const ScreenHeaderDelete = ({customFunction}) => {
    const handlePress = () => {
        if (customFunction) {
            customFunction()
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    handlePress()
                }}>
                <KText
                    style={styles.text}
                    bold
                    text={translate('app.delete')}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        borderColor: colors.red,
        borderRadius: hp(25),
        borderWidth: hp(2),
        marginRight: wp(10),
        minWidth: wp(100),
        paddingVertical: hp(10),
    },
    text: {
        color: colors.red,
        textAlign: 'center',
    },
})

export default withNavigation(ScreenHeaderDelete)
