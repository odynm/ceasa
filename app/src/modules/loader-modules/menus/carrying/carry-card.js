import React from 'react'
import {wp} from 'src/utils/screen'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'

const CarryCard = ({name, onPress, selected}) => {
    const selectedStyle = selected ? styles.selected : undefined
    const selectedStyleText = selected ? styles.selectedText : undefined

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.card, selectedStyle]}>
                <KText
                    style={selectedStyleText}
                    bold
                    fontSize={18}
                    text={name}
                />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        borderColor: colors.primary,
        borderRightWidth: 1,
        paddingHorizontal: wp(15),
    },
    selected: {
        backgroundColor: colors.primary,
    },
    selectedText: {
        color: 'white',
    },
})

export default CarryCard
