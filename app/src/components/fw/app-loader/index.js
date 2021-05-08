import React from 'react'
import {connect} from 'react-redux'
import Loader from '../loader'

const AppLoading = ({appLoader, children, solid}) => (
    <>
        {solid && appLoader ? (
            <>{<Loader fullScreen />}</>
        ) : (
            <>
                {children}
                {appLoader && <Loader fullScreen />}
            </>
        )}
    </>
)

const mapStateToProps = ({app}) => ({
    appLoader: app.appLoader,
})

export default connect(mapStateToProps)(AppLoading)
