import React from 'react'
import { View, Text } from 'react-native'
import { translate } from 'src/i18n/translate'
import KText from 'src/components/fw/ktext'
import ScreenHeader from 'src/components/fw/screen-header'

const Orders = () => {
	return (
		<View>
			<KText text={'Hello World Again'} />
			<Text>Hello World Again</Text>
		</View>
	)
}

Orders.navigationOptions = () => ({
	title: translate('menus.home'),
	headerLeft: props => <ScreenHeader {...props} />,
})

export default Orders
