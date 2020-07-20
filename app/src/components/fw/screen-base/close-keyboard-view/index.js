import React from 'react'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'

const CloseKeyboard = Comp => {
	return ({ children, ...props }) => (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<Comp {...props}>{children}</Comp>
		</TouchableWithoutFeedback>
	)
}
const CloseKeyboardView = CloseKeyboard(View)

export default CloseKeyboardView
