import React from 'react'
import { hp, wp } from 'src/utils/screen'
import { translate } from 'src/i18n/translate'
import { Modal, ScrollView, StyleSheet, View } from 'react-native'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'
import Button from 'src/components/fw/button'

const GenericModal = ({
	title,
	message,
	modalData,
	closeModal,
	numberStack,
}) => {
	return (
		<Modal transparent={true}>
			{numberStack > 0 && (
				<KText
					bold
					fontSize={24}
					style={styles.number}
					text={numberStack}
				/>
			)}
			<View style={styles.view}>
				<View style={styles.modal}>
					<KText bold style={styles.title} text={title} />
					<KText style={styles.message} text={message} />
					<KText
						bold
						fontSize={18}
						style={styles.message}
						text={modalData?.content?.client?.key}
					/>
					<View style={styles.infoRow}>
						<KText text={translate('loaderOrderInfo.clientPlace')} />
						<KText text={modalData?.content?.client?.place} />
					</View>
					<View style={styles.infoRow}>
						<KText text={translate('loaderOrderInfo.clientVehicle')} />
						<KText text={modalData?.content?.client?.vehicle} />
					</View>
					<View style={styles.products}>
						<KText
							style={styles.message}
							text={translate('loaderOrderInfo.products')}
						/>
						<ScrollView style={styles.scrollView}>
							{modalData?.content?.products?.length > 0
								? modalData.content.products.map((item, i) => (
										<View style={styles.card} key={i}>
											<View style={styles.infoRow}>
												<KText
													text={`${item.productName} ${
														item.productTypeName
													}`}
												/>
												<KText text={item.amount} />
											</View>
											<KText text={item.description} />
										</View>
								  ))
								: undefined}
						</ScrollView>
					</View>
					<Button
						small
						style={styles.button}
						label={'Ok'}
						onPress={closeModal}
					/>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	view: {
		alignItems: 'center',
		backgroundColor: '#bbbbbb66',
		bottom: 0,
		flex: 1,
		position: 'absolute',
		top: 0,
		width: '100%',
	},
	modal: {
		width: wp(320),
		height: hp(600),
		backgroundColor: 'white',
		marginTop: hp(100),
		borderRadius: wp(10),
		paddingVertical: hp(10),
		paddingHorizontal: wp(10),
	},
	title: {
		borderBottomWidth: 1,
		borderColor: colors.primary,
	},
	message: {
		marginTop: hp(10),
	},
	button: {
		marginTop: 'auto',
		marginBottom: hp(30),
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	card: {
		borderRadius: wp(10),
		borderColor: colors.primary,
		borderWidth: 1,
		paddingVertical: hp(5),
		paddingHorizontal: wp(5),
		marginBottom: hp(10),
	},
	products: {
		flex: 1,
		marginVertical: hp(10),
	},
	scrollView: {
		flex: 1,
	},
	number: {
		color: 'white',
		backgroundColor: colors.red,
		position: 'absolute',
		width: wp(40),
		height: hp(40),
		borderRadius: wp(5),
		textAlign: 'center',
		top: hp(90),
		right: wp(20),
		zIndex: 99,
	},
})

export default GenericModal
