import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    alignCenter: {
        alignItems: 'center',
    },
    flexCenter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    copyIcon: {
        alignSelf: 'center',
        transform: [{scaleX: 0.8}, {scaleY: 0.8}],
    },
})

export default styles
