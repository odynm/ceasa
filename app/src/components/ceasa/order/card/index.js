import React from 'react'
import { wp, hp } from 'src/utils/screen'
import { translate } from 'src/i18n/translate'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import orderStatus from 'src/enums/order'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'

const OrderCard = ({
	status,
	loader,
	urgent,
	onPress,
	clientKey,
	releasedHour,
	completedHour,
}) => {
	const style = [
		styles.container,
		urgent
			? styles.red
			: status === orderStatus.blocked
			? styles.white
			: status === orderStatus.carrying
			? styles.green
			: status === orderStatus.done
			? styles.blue
			: undefined,
	]

	return (
		<TouchableOpacity onPress={onPress}>
			<View style={style}>
				<View style={styles.card}>
					<View style={styles.row}>
						{urgent && (
							<KText
								bold
								fontSize={14}
								text={translate('orders.urgent')}
							/>
						)}
						{status !== orderStatus.blocked && (
							<KText
								bold
								fontSize={14}
								style={styles.loader}
								text={loader && loader.toUpperCase()}
							/>
						)}
					</View>
					<View style={styles.row}>
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
								style={styles.hourReleased}
							/>
						)}
					</View>
					{status === orderStatus.done && (
						<KText
							fontSize={14}
							style={styles.hourReleased}
							text={`${translate('orders.doneAt')} ${completedHour}`}
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
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		borderColor: colors.primary,
		borderRadius: wp(10),
		borderWidth: 1,
		marginBottom: hp(10),
	},
	card: {
		paddingHorizontal: wp(10),
		paddingVertical: hp(5),
		minHeight: hp(85),
	},
	row: {
		flexDirection: 'row',
	},
	white: {
		backgroundColor: 'white',
	},
	green: {
		backgroundColor: '#C4FFA0',
	},
	blue: {
		backgroundColor: '#81CAFF',
	},
	red: {
		backgroundColor: '#FF9595',
	},
	loader: {
		marginLeft: 'auto',
		marginRight: 0,
	},
	client: {},
	hourReleased: {
		marginLeft: 'auto',
		marginRight: 0,
		alignSelf: 'center',
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
