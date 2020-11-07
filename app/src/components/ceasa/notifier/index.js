import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { Creators as NotificationsCreators } from 'src/ducks/notifications'
import GenericModal from './genericModal'
import NotifierService from 'src/services/notifierService'

const Notifier = ({
	editionModal,
	cancelationModal,
	setEditionModal,
	setCancelationModal,
}) => {
	useEffect(() => {
		NotifierService.start()
	}, [])

	return (
		<>
			{editionModal.open && (
				<GenericModal
					title={translate('notifications.editOrder.title')}
					message={translate('notifications.editOrder.message')}
					modalData={editionModal}
					setModalData={setEditionModal}
				/>
			)}
			{cancelationModal.open && (
				<GenericModal
					title={translate('notifications.deleteOrder.title')}
					message={translate('notifications.deleteOrder.message')}
					modalData={cancelationModal}
					setModalData={setCancelationModal}
				/>
			)}
		</>
	)
}

const mapStateToProps = ({ notifications }) => ({
	editionModal: notifications.editionModal,
	cancelationModal: notifications.cancelationModal,
})

const mapDispatchToProps = {
	setEditionModal: NotificationsCreators.setEditionModal,
	setCancelationModal: NotificationsCreators.setCancelationModal,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Notifier)
