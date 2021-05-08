import React from 'react'
import {hp} from 'src/utils/screen'
import {View, StyleSheet} from 'react-native'

const Space = ({size2, size4}) => (
    <View
        style={size4 ? styles.space4 : size2 ? styles.space2 : styles.space}
    />
)

const styles = StyleSheet.create({
    space: {
        marginBottom: hp(10),
    },
    space2: {
        marginBottom: hp(20),
    },
    space4: {
        marginBottom: hp(40),
    },
})

export default Space
