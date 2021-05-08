import React from 'react'
import {connect} from 'react-redux'
import {Creators as OrderCreators} from 'src/ducks/order'
import ScreenHeader from 'src/components/fw/screen-header'

const SellHeader = (props) => (
    <ScreenHeader
        noBack={!props.isClientStep}
        customFunction={() => props.setClientStep(false)}
        {...props}
    />
)

const mapStateToProps = ({order}) => ({
    isClientStep: order.clientStep,
})

const mapDispatchToProps = {
    setClientStep: OrderCreators.setClientStep,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SellHeader)
