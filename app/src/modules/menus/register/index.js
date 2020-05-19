import React from 'react'
import { View, Text } from 'react-native'
import ScreenHeader from 'src/components/screen-header'
import { SvgXml } from 'react-native-svg'

const Register = () => {
	return (
		<View>
			<Text>Hello World 222222222222222</Text>
			<Text>Hello World 2222222222222222222222</Text>
		</View>
	)
}

Register.navigationOptions = () => ({
	headerLeft: props => <ScreenHeader {...props} />,
})

export default Register
