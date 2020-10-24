import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { Creators as EditOrderCreators } from 'src/ducks/order/edit-order'
import ToastService from 'src/services/toastService'
import ScreenHeaderDelete from 'src/components/fw/screen-header-delete'

const ScreenHeaderDeleteOrder = ({ noConnection, setConfirmDelete }) => {
	return (
		<ScreenHeaderDelete
			customFunction={() => {
				if (noConnection) {
					ToastService.show({
						message: translate('app.noConnectionError'),
					})
				} else {
					setConfirmDelete(true)
				}
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
