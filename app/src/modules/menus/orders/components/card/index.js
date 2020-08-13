import React from 'react'
import { wp, hp } from 'src/utils/screen'
import { translate } from 'src/i18n/translate'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import orderStatus from 'src/enums/order'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'

const OrderCard = ({ clientKey, status, loader, editOrder, releasedHour }) => {
	const style = [
		styles.container,
		status === orderStatus.blocked ? styles.white : undefined,
	]

	return (
		<TouchableWithoutFeedback onPress={editOrder}>
			<View style={style}>
				<View style={styles.card}>
					<KText fontSize={14} text={loader} style={styles.loader} />
					<KText
						bold
						fontSize={18}
						text={clientKey}
						style={styles.client}
					/>
					{status !== orderStatus.blocked && (
						<KText
							fontSize={14}
							text={releasedHour}
							style={styles.hour}
						/>
					)}
				</View>
				{status === orderStatus.blocked && (
					<KText
						bold
						fontSize={14}
						text={translate('orders.blocked')}
						style={styles.blocked}
					/>
				)}
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	container: {
		borderColor: colors.primary,
		borderRadius: wp(10),
		borderWidth: 1,
	},
	card: {
		paddingHorizontal: wp(10),
		paddingVertical: hp(5),
	},
	white: {
		backgroundColor: 'white',
	},
	loader: {
		marginLeft: 'auto',
		marginRight: 0,
	},
	client: {},
	hour: {
		marginLeft: 'auto',
		marginRight: 0,
	},
	blocked: {
		backgroundColor: '#F9F0A5',
		borderBottomLeftRadius: wp(10),
		borderBottomRightRadius: wp(10),
		borderColor: colors.primary,
		textAlign: 'center',
	},
})

export default OrderCard
