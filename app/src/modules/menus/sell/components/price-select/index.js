import React, { useState, useEffect } from 'react'
import { translate } from 'src/i18n/translate'
import { View, StyleSheet } from 'react-native'
import KText from 'src/components/fw/ktext'
import Space from 'src/components/fw/space'
import KModal from 'src/components/fw/kmodal'
import Button from 'src/components/fw/button'
import Amount from 'src/components/fw/amount'
import MoneyService from 'src/services/moneyService'
import MoneyInput from 'src/components/fw/money-input'
import CloseKeyboardView from 'src/components/fw/screen-base/close-keyboard-view'

const PriceSelect = ({ onClose, open, selectedProduct }) => {
	const [amount, setAmount] = useState(1)
	const [price, setPrice] = useState({ text: '', value: 0 })
	const [total, setTotal] = useState({ text: '0,00', value: 0.0 })

	const updateTotal = () => {
		setTotal(MoneyService.toMoney(amount * price.value, 'BRL'))
	}

	const handlePriceChange = value => {
		setPrice(value)
		updateTotal()
	}

	useEffect(() => {
		updateTotal()
	}, [amount])

	return (
		<KModal
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
			<CloseKeyboardView>
				<KText text={selectedProduct.description} />
				<View style={styles.row}>
					<KText bold text={translate('sell.sellAvailable')} />
					<KText bold style={styles.right} text={selectedProduct.amount} />
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
						style={styles.right}
						value={price}
						setValue={handlePriceChange}
						label={translate('sell.sellUnitPrice')}
					/>
				</View>
				<Space />
				<View style={styles.row}>
					<KText bold text={translate('sell.sellTotal')} />
					<KText bold style={styles.right} text={total.text} />
				</View>
				<Space />
				<Button small label={translate('sell.add')} onPress={() => {}} />
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
})

export default PriceSelect
