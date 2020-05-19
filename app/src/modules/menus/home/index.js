import React from 'react'
import { View, Text } from 'react-native'
import ScreenHeader from 'src/components/screen-header'

const Home = () => {
	return (
		<View>
			<Text>Hello World Again</Text>
			<Text>Hello World Again</Text>
		</View>
	)
}

Home.navigationOptions = () => ({
	headerLeft: props => <ScreenHeader {...props} />,
})

export default Home
