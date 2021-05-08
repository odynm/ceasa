import React from 'react'
import {fv} from 'src/utils/screen'
import {Text, StyleSheet} from 'react-native'
import colors from 'src/constants/colors'

const KText = ({style, text, fontSize, bold, link}) => {
    const weightStyle = bold ? styles.bold : styles.regular
    const coloredStyle = link ? {...weightStyle, ...styles.link} : weightStyle
    const fontSizeStyle =
        fontSize > 0 ? {...coloredStyle, fontSize: fv(fontSize)} : coloredStyle
    const mergedStyles = {...styles.font, ...fontSizeStyle}
    return <Text style={[mergedStyles, style]}>{text}</Text>
}

const styles = StyleSheet.create({
    font: {
        color: colors.primary,
        fontSize: fv(16),
    },
    regular: {
        fontFamily: 'NotoSansBengaliUI-Regular',
    },
    bold: {
        fontFamily: 'NotoSansBengaliUI-Bold',
    },
    link: {
        color: colors.link,
    },
})

export default KText
