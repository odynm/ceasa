import React, {useState, useEffect} from 'react'
import {translate} from 'src/i18n/translate'
import rfdc from 'rfdc'
import ModalPrice from './price'
import MoneyService from 'src/services/moneyService'
import ModalExceededStorage from './exceededStorage'
import MergedProductsService from 'src/services/mergedProductsService'

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
    const [price, setPrice] = useState({text: '0,00', value: 0.0})
    const [total, setTotal] = useState({text: '0,00', value: 0.0})
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

    const updateTotal = (value) => {
        if (value) {
            setTotal(
                MoneyService.toMoney(
                    amount * value,
                    MoneyService.getCurrency().text,
                ),
            )
        } else if (price.value) {
            setTotal(
                MoneyService.toMoney(
                    amount * price.value,
                    MoneyService.getCurrency().text,
                ),
            )
        }
    }

    const handlePriceChange = (value) => {
        setPrice(value)
        updateTotal(value.value)
    }

    const cleanup = () => {
        setAmount(1)
        setPrice({text: '', value: 0.0})
        setTotal({text: '0,00', value: 0.0})
        setModalExceededStorageOpen(false)
        setErrors({})
        onClose()
    }

    const addItem = ({storageAmount}) => {
        addProduct({
            amount: amount,
            id: selectedProduct.id,
            storageAmount: storageAmount,
            // This is clunky, but its correct because of the way we treat products:
            // * sometimes we use storedItems, which only have an "id" prop
            // * sometimes we use orderITems, which have an "storageId" prop
            storageId: selectedProduct.storageId
                ? selectedProduct.storageId
                : selectedProduct.id,
            total: {text: total.text, value: total.value}, // to pass by value
            unitPrice: {text: price.text, value: price.value}, // to pass by value
            description: selectedProduct.description,
            descriptionId: selectedProduct.descriptionId,
            productName: selectedProduct.productName,
            productId: selectedProduct.productId,
            productTypeName: selectedProduct.productTypeName,
            productTypeId: selectedProduct.productTypeId,

            costPrice: selectedProduct?.isMerged
                ? MergedProductsService.calculateMergedPrice(
                      selectedProduct.mergedData.items,
                  ).text
                : {
                      text: selectedProduct.costPrice.text,
                      costPrice: selectedProduct.costPrice.value,
                  },

            // Very important item, changes how everything is interpreted on the system
            isMerged: selectedProduct.isMerged,
            mergedData: selectedProduct.isMerged
                ? rfdc()(selectedProduct.mergedData) // to pass by value
                : undefined,
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
            setErrors({
                ...errors,
                price: translate('sell.errors.priceRequired'),
            })
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
                addItem={addItemExceeded}
                exceeded={amount - available}
                open={modalExceededStorageOpen}
                selectedProduct={selectedProduct}
                handleCloseExceededStorage={handleCloseExceededStorage}
            />
        </>
    )
}

export default PriceSelect
