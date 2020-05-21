import React from 'react'
import { View, Text } from 'react-native'
import { translate } from 'src/i18n/translate'
import KText from 'src/components/fw/ktext'
import ScreenHeader from 'src/components/fw/screen-header'

const Home = () => {
	return (
		<View>
			<KText text={'Hello World Again'} />
			<Text>Hello World Again</Text>
		</View>
	)
}

Home.navigationOptions = () => ({
	title: translate('register.home'),
	headerLeft: props => <ScreenHeader {...props} />,
})

export default Home
