import React from 'react'
import { View, Text } from 'react-native'
import { translate } from 'src/i18n/translate'
import KText from 'src/components/fw/ktext'
import ScreenHeader from 'src/components/fw/screen-header'

const Home = () => {
	return (
		<View>
			<KText text={'-'} />
		</View>
	)
}

Home.navigationOptions = () => ({
	title: translate('menus.home'),
	headerLeft: props => <ScreenHeader noBack {...props} />,
})

export default Home
