import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { translate } from 'src/i18n/translate'
import { Creators as NotificationsCreators } from 'src/ducks/notifications'
import GenericModal from './genericModal'
import notificationType from 'src/enums/notifications'
import NotifierService from 'src/services/notifierService'

const Notifier = ({ notifications, popLastNotification }) => {
	const [curNotification, setCurNotification] = useState({})

	useEffect(() => {
		NotifierService.start()
	}, [])

	useEffect(() => {
		if (notifications?.length > 0) {
			const cur = notifications[0]

			setCurNotification({
				title:
					cur.type === notificationType.edited
						? translate('notifications.editOrder.title')
						: translate('notifications.deleteOrder.title'),
				message:
					cur.type === notificationType.edited
						? translate('notifications.editOrder.message')
						: translate('notifications.deleteOrder.message'),
				editionModal: cur,
			})
		}
	}, [notifications])

	return (
		<>
			{notifications?.length > 0 && (
				<GenericModal
					title={curNotification.title}
					closeModal={popLastNotification}
					message={curNotification.message}
					numberStack={notifications?.length}
					modalData={curNotification.editionModal}
				/>
			)}
		</>
	)
}

const mapStateToProps = ({ notifications }) => ({
	notifications: notifications.notifications,
})

const mapDispatchToProps = {
	popLastNotification: NotificationsCreators.popLastNotification,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Notifier)
