import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { Creators as EditStorage } from 'src/ducks/storage/edit-storage'
import ToastService from 'src/services/toastService'
import ScreenHeaderDelete from 'src/components/fw/screen-header-delete'

const ScreenHeaderDeleteStorage = ({ noConnection, setConfirmDelete }) => {
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
	setConfirmDelete: EditStorage.setConfirmDelete,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ScreenHeaderDeleteStorage)
