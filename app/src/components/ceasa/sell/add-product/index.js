import React, { useState } from 'react'
import { Selectors as StorageSelectors } from 'src/ducks/storage'
import PriceSelect from '../price-select'
import ProductSelect from '../product-select'

const AddProduct = ({
	open,
	setOpen,
	addProduct,
	storageItems,
	removeProduct,
	alreadyAddedProducts,
}) => {
	const [sellModalOpen, setSellModalOpen] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState({})

	const selectProduct = item => {
		setSellModalOpen(true)
		setSelectedProduct(item)
	}

	const onClose = () => {
		setSellModalOpen(false)
		setOpen(false)
	}

	return (
		<>
			{open ? (
				<>
					<ProductSelect
						onClose={onClose}
						storageItems={storageItems}
						open={open && !sellModalOpen}
						selectProduct={selectProduct}
						alreadyAddedProducts={alreadyAddedProducts}
					/>
					<PriceSelect
						onClose={onClose}
						addProduct={addProduct}
						open={open && sellModalOpen}
						removeProduct={removeProduct}
						selectedProduct={selectedProduct}
						available={StorageSelectors.getAvailable({
							storageItems: storageItems,
							product: selectedProduct,
						})}
					/>
				</>
			) : null}
		</>
	)
}

export default AddProduct
