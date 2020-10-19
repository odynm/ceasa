import React, { useState, useEffect } from 'react'
import { translate } from 'src/i18n/translate'
import ModalPrice from './price'
import ModalExceededStorage from './exceededStorage'
import MoneyService from 'src/services/moneyService'

const PriceSelect = ({
	edit,
	open,
	onClose,
	available,
	addProduct,
	removeProduct,
	initialValues,
	selectedProduct,
}) => {
	const [errors, setErrors] = useState({})
	const [amount, setAmount] = useState(1)
	const [price, setPrice] = useState({ text: '0,00', value: 0.0 })
	const [total, setTotal] = useState({ text: '0,00', value: 0.0 })
	const [modalExceededStorageOpen, setModalExceededStorageOpen] = useState(
		false,
	)

	useEffect(() => {
		if (initialValues && initialValues.price && initialValues.amount) {
			setPrice(initialValues.price)
			setAmount(initialValues.amount)
		}
	}, [initialValues])

	useEffect(() => {
		updateTotal()
	}, [amount])

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
		setTimeout(updateTotal, 500)
	}

	const cleanup = () => {
		setAmount(1)
		setPrice({ text: '', value: 0.0 })
		setTotal({ text: '0,00', value: 0.0 })
		setModalExceededStorageOpen(false)
		setErrors({})
		onClose()
	}

	const addItem = ({ storageAmount }) => {
		addProduct({
			amount: amount,
			id: selectedProduct.id,
			storageAmount: storageAmount,
			total: { text: total.text, value: total.value }, // to pass by value
			unitPrice: { text: price.text, value: price.value }, // to pass by value
			description: selectedProduct.description,
			productName: selectedProduct.productName,
			productTypeName: selectedProduct.productTypeName,
		})
		cleanup()
	}

	const handleAdd = () => {
		if (price.value > 0.0) {
			if (amount > available) {
				setModalExceededStorageOpen(true)
			} else {
				addItem({
					storageAmount: amount,
				})
			}
		} else {
			setErrors({ ...errors, price: translate('sell.errors.priceRequired') })
		}
	}

	const addItemExceeded = () => {
		addItem({
			storageAmount: amount > available ? available : amount,
		})
	}

	const handleDelete = () => {
		removeProduct(selectedProduct)
		cleanup()
	}

	const handleCloseExceededStorage = () => {
		setModalExceededStorageOpen(false)
	}
	return (
		<>
			<ModalPrice
				edit={edit}
				open={open}
				total={total}
				price={price}
				errors={errors}
				amount={amount}
				onClose={onClose}
				setPrice={setPrice}
				handleAdd={handleAdd}
				setAmount={setAmount}
				available={available}
				handleDelete={handleDelete}
				selectedProduct={selectedProduct}
				handlePriceChange={handlePriceChange}
			/>
			<ModalExceededStorage
				amount={amount}
				addItem={addItemExceeded}
				open={modalExceededStorageOpen}
				selectedProduct={selectedProduct}
				handleCloseExceededStorage={handleCloseExceededStorage}
			/>
		</>
	)
}

export default PriceSelect
