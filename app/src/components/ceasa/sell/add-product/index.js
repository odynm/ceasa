import React, { useState } from 'react'
import PriceSelect from '../price-select'
import ProductSelect from '../product-select'

const AddProduct = ({ storageItems, addProduct, open, setOpen }) => {
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
					/>
					<PriceSelect
						onClose={onClose}
						addProduct={addProduct}
						open={open && sellModalOpen}
						selectedProduct={selectedProduct}
					/>
				</>
			) : null}
		</>
	)
}

export default AddProduct
