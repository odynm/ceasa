import React, { useState, useEffect } from 'react'
import { translate } from 'src/i18n/translate'
import ModalPrice from './price'
import ModalExceededStorage from './exceededStorage'
import MoneyService from 'src/services/moneyService'

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
		setErrors({})
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
	return (
		<>
			<ModalPrice
				open={open}
				total={total}
				price={price}
				errors={errors}
				amount={amount}
				onClose={onClose}
				handleAdd={handleAdd}
				setAmount={setAmount}
				selectedProduct={selectedProduct}
				handlePriceChange={handlePriceChange}
			/>
			<ModalExceededStorage
				amount={amount}
				addItem={addItem}
				open={modalExceededStorageOpen}
				selectedProduct={selectedProduct}
				handleCloseExceededStorage={handleCloseExceededStorage}
			/>
		</>
	)
}

export default PriceSelect
