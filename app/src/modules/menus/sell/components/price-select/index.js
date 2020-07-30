import React, { useState, useEffect } from 'react'
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

const PriceSelect = ({ open, onClose, addProduct, selectedProduct }) => {
	const [errors, setErrors] = useState({})
	const [amount, setAmount] = useState(1)
	const [price, setPrice] = useState({ text: '', value: 0.0 })
	const [total, setTotal] = useState({ text: '0,00', value: 0.0 })
	const [modalExceededStorageOpen, setModalExceededStorageOpen] = useState(
		false,
	)

	const updateTotal = () => {
		if (price.value) {
			setTotal(
				MoneyService.toMoney(
					amount * price.value,
					MoneyService.getCurrency().text,
				),
			)
		}
	}

	const handlePriceChange = value => {
		setPrice(value)
		updateTotal()
	}

	useEffect(() => {
		updateTotal()
	}, [amount])

	const addItem = () => {
		addProduct({
			amount: amount,
			total: { text: total.text, value: total.value }, // to pass by value
			unitPrice: { text: price.text, value: price.value }, // to pass by value
			description: selectedProduct.description,
			productName: selectedProduct.productName,
			productTypeName: selectedProduct.productTypeName,
		})
		setAmount(1)
		setPrice({ text: '', value: 0.0 })
		setTotal({ text: '0,00', value: 0.0 })
		setModalExceededStorageOpen(false)
		onClose()
	}

	const handleAdd = () => {
		if (price.value > 0.0) {
			if (amount > selectedProduct.amount) {
				setModalExceededStorageOpen(true)
			} else {
				addItem()
			}
		} else {
			setErrors({ ...errors, price: translate('sell.errors.priceRequired') })
		}
	}

	const handleCloseExceededStorage = () => {
		setModalExceededStorageOpen(false)
	}

	const colorStyle =
		amount > selectedProduct.amount ? { color: colors.red } : {}

	return (
		<>
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
						label={translate('sell.add')}
						onPress={handleAdd}
					/>
				</CloseKeyboardView>
			</KModal>
			<KModal
				size={250}
				open={modalExceededStorageOpen}
				onClose={handleCloseExceededStorage}
				header={translate('sell.finishSell')}>
				<KText fontSize={18} bold text={translate('sell.areYouSure')} />
				<KText bold text={translate('sell.dontHaveInStorage')} />
				<Space />
				<View style={styles.row}>
					<KText
						bold
						text={`${selectedProduct.productName} ${
							selectedProduct.productTypeName
						}`}
					/>
					<KText
						bold
						style={styles.right}
						text={amount - selectedProduct.amount}
					/>
				</View>
				<View style={styles.rowButtons}>
					<Button
						tiny
						style={styles.redButtonView}
						textStyle={styles.redButtonText}
						label={translate('sell.no')}
						onPress={handleCloseExceededStorage}
					/>
					<Button tiny label={translate('sell.yes')} onPress={addItem} />
				</View>
			</KModal>
		</>
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
	rowButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: hp(15),
		marginTop: 'auto',
	},
	redButtonView: {
		borderColor: colors.red,
	},
	redButtonText: {
		color: colors.red,
	},
})

export default PriceSelect
