import React from 'react'
import { connect } from 'react-redux'
import { Creators as EditStorage } from 'src/ducks/storage/edit-storage'
import ScreenHeaderDelete from 'src/components/fw/screen-header-delete'

const ScreenHeaderDeleteStorage = ({ setConfirmDelete }) => {
	return (
		<ScreenHeaderDelete
			customFunction={() => {
				setConfirmDelete(true)
			}}
		/>
	)
}

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {
	setConfirmDelete: EditStorage.setConfirmDelete,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ScreenHeaderDeleteStorage)
