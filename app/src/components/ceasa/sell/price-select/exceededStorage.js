import React from 'react'
import {hp} from 'src/utils/screen'
import {translate} from 'src/i18n/translate'
import {View, StyleSheet} from 'react-native'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'
import Space from 'src/components/fw/space'
import KModal from 'src/components/fw/kmodal'
import Button from 'src/components/fw/button'

const ModalExceededStorage = ({
    open,
    exceeded,
    addItem,
    selectedProduct,
    handleCloseExceededStorage,
}) => {
    return (
        <KModal
            size={250}
            open={open}
            onClose={handleCloseExceededStorage}
            header={translate('sell.modal.finishSell')}>
            <KText
                fontSize={18}
                bold
                text={translate('sell.modal.areYouSure')}
            />
            <KText bold text={translate('sell.modal.dontHaveInStorage')} />
            <Space />
            <View style={styles.row}>
                <KText
                    bold
                    text={`${selectedProduct.productName} ${
                        selectedProduct.productTypeName
                    }`}
                />
                <KText bold style={styles.right} text={exceeded} />
            </View>
            <View style={styles.rowButtons}>
                <Button
                    tiny
                    label={translate('app.no')}
                    style={styles.redButtonView}
                    textStyle={styles.redButtonText}
                    onPress={handleCloseExceededStorage}
                />
                <Button tiny label={translate('app.yes')} onPress={addItem} />
            </View>
        </KModal>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    right: {
        marginLeft: 'auto',
        marginRight: 0,
    },
    button: {
        marginBottom: 0,
        marginTop: 'auto',
    },
    rowButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(15),
        marginTop: 'auto',
    },
    redButtonView: {
        borderColor: colors.red,
    },
    redButtonText: {
        color: colors.red,
    },
})

export default ModalExceededStorage
