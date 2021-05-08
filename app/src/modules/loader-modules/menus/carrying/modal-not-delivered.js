import React from 'react'
import {hp} from 'src/utils/screen'
import {translate} from 'src/i18n/translate'
import {View, StyleSheet} from 'react-native'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'
import Space from 'src/components/fw/space'
import KModal from 'src/components/fw/kmodal'
import Button from 'src/components/fw/button'

const ModalNotDelivered = ({open, products, handleCloseYes, handleCloseNo}) => {
    return (
        <KModal
            size={400}
            open={open}
            onClose={handleCloseNo}
            header={translate('loaderCarrying.modal.finishCarry')}>
            <KText
                fontSize={18}
                bold
                text={translate('loaderCarrying.modal.areYouSure')}
            />
            <KText
                bold
                text={translate('loaderCarrying.modal.itemsNotDelivered')}
            />
            <Space />
            {products.map((item, index) => (
                <View key={index} style={styles.row}>
                    <KText
                        bold
                        text={`${item.productName} ${item.productTypeName}`}
                    />
                    <KText
                        bold
                        style={styles.right}
                        text={item.amount - item.amountDelivered}
                    />
                </View>
            ))}
            <View style={styles.rowButtons}>
                <Button
                    tiny
                    onPress={handleCloseNo}
                    label={translate('app.no')}
                    style={styles.redButtonView}
                    textStyle={styles.redButtonText}
                />
                <Button
                    tiny
                    onPress={handleCloseYes}
                    label={translate('app.yes')}
                />
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

export default ModalNotDelivered
