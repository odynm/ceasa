import React from 'react'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { Creators as EditOrderCreators } from 'src/ducks/order/edit-order'
import ScreenHeader from 'src/components/fw/screen-header'

const ScreenHeaderDeleteOrder = ({
	navigation,
	setConfirmBack,
	productListIsDirty,
}) => {
	return (
		<ScreenHeader
			customFunction={() => {
				if (productListIsDirty) {
					setConfirmBack(true)
				} else {
					navigation.goBack(null)
				}
			}}
		/>
	)
}

const mapStateToProps = ({ editOrder }) => ({
	productListIsDirty: editOrder.productListIsDirty,
})

const mapDispatchToProps = {
	setConfirmBack: EditOrderCreators.setConfirmBack,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withNavigation(ScreenHeaderDeleteOrder))
