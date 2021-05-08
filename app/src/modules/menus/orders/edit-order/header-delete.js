import React from 'react'
import {connect} from 'react-redux'
import {Creators as EditOrderCreators} from 'src/ducks/order/edit-order'
import ScreenHeaderDelete from 'src/components/fw/screen-header-delete'

const ScreenHeaderDeleteOrder = ({setConfirmDelete}) => {
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
    setConfirmDelete: EditOrderCreators.setConfirmDelete,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ScreenHeaderDeleteOrder)
