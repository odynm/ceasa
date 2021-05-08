import React, {useState, useEffect} from 'react'
import {Keyboard} from 'react-native'
import {getWorkableArea, hp} from 'src/utils/screen'
import ScreenBaseComponent from './component'

const ScreenBase = ({extraHeight, useKeyboardAvoid, ...props}) => {
    const [keyboardHeight, setKeyboardHeight] = useState(0)

    useEffect(() => {
        const handlerShow = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height)
        })
        const handlerHide = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0)
        })

        return () => {
            handlerShow.remove()
            handlerHide.remove()
        }
    }, [])

    const heightStyle = {
        height:
            getWorkableArea() + extraHeight
                ? hp(extraHeight)
                : 0 - (useKeyboardAvoid ? keyboardHeight : 0),
        flex: 1,
    }

    return <ScreenBaseComponent heightStyle={heightStyle} {...props} />
}

ScreenBase.defaultProps = {
    useScroll: true,
    useKeyboardAvoid: true,
    useKeyboardClose: true,
}

export default ScreenBase
