import React from 'react'
import { hp } from 'src/utils/screen'
import { translate } from 'src/i18n/translate'
import { View, StyleSheet } from 'react-native'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'
import Space from 'src/components/fw/space'
import KModal from 'src/components/fw/kmodal'
import Button from 'src/components/fw/button'
import Amount from 'src/components/fw/amount'
import MoneyService from 'src/services/moneyService'
import MoneyInput from 'src/components/fw/money-input'
import CloseKeyboardView from 'src/components/fw/screen-base/close-keyboard-view'

const ModalPrice = ({
	edit,
	open,
	total,
	price,
	errors,
	amount,
	onClose,
	setAmount,
	handleAdd,
	selectedProduct,
	handlePriceChange,
}) => {
	const colorStyle =
		amount > selectedProduct.amount ? { color: colors.red } : {}

	return (
		<KModal
			size={400}
			open={open}
			onClose={onClose}
			header={translate('sell.sellProduct')}>
			<KText
				bold
				fontSize={24}
				text={`${selectedProduct.productName} ${
					selectedProduct.productTypeName
				}`}
			/>
			<CloseKeyboardView style={styles.closeKeyboardView}>
				<KText text={selectedProduct.description} />
				<View style={styles.row}>
					<KText bold text={translate('sell.sellAvailable')} />
					<KText
						bold
						style={[styles.right, colorStyle]}
						text={selectedProduct.amount}
					/>
				</View>
				<Space size2 />
				<View style={styles.row}>
					<Amount
						value={amount}
						setValue={setAmount}
						style={styles.right}
						label={translate('sell.sellAmount')}
					/>
				</View>
				<Space />
				<View style={styles.row}>
					<MoneyInput
						errorMessage={errors.price}
						max={9999}
						value={price}
						style={styles.right}
						setValue={handlePriceChange}
						label={translate('sell.sellUnitPrice')}
					/>
				</View>
				<Space />
				<View style={styles.row}>
					<KText bold text={translate('sell.sellTotal')} />
					<KText
						bold
						style={styles.right}
						text={`${MoneyService.getCurrency().text} ${total.text}`}
					/>
				</View>
				<Space />
				<View style={styles.warning}>
					{amount > selectedProduct.amount && (
						<KText
							bold
							style={colorStyle}
							text={translate('sell.exceededWarning')}
						/>
					)}
				</View>
				<Button
					small
					style={styles.button}
					onPress={handleAdd}
					label={edit ? translate('sell.edit') : translate('sell.add')}
				/>
			</CloseKeyboardView>
		</KModal>
	)
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
	},
	right: {
		marginLeft: 'auto',
		marginRight: 0,
	},
	closeKeyboardView: {
		flex: 1,
	},
	warning: {
		alignItems: 'center',
		marginBottom: hp(10),
		marginTop: 'auto',
	},
	button: {
		marginBottom: 0,
		marginTop: 'auto',
	},
})

export default ModalPrice
