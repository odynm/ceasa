import React from 'react'
import { connect } from 'react-redux'
import ScreenHeaderDelete from 'src/components/fw/screen-header-delete'
import { Creators as EditOrderCreators } from 'src/ducks/order/edit-order'

const ScreenHeaderDeleteOrder = ({ noConnection, setConfirmDelete }) => {
	return (
		<ScreenHeaderDelete
			customFunction={() => {
				setConfirmDelete(true)
			}}
		/>
	)
}

const mapStateToProps = ({ app }) => ({ noConnection: app.noConnection })

const mapDispatchToProps = {
	setConfirmDelete: EditOrderCreators.setConfirmDelete,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ScreenHeaderDeleteOrder)
