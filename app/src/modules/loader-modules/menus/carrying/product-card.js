import React from 'react'
import { hp, wp } from 'src/utils/screen'
import { translate } from 'src/i18n/translate'
import { View, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'

const RoundButton = ({ label, onPress, disabled }) => (
    <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={[
            styles.roundButton,
            disabled ? styles.disabledButton : undefined,
        ]}>
        <KText
            text={label}
            fontSize={24}
            style={disabled ? styles.disabledText : undefined}
        />
    </TouchableOpacity>
)

const ProductCard = ({
    id,
    orderId,
    amount,
    exceeded,
    product,
    productType,
    description,
    amountDelivered,
    setAmountDelivered,
}) => {
    return (
        <View
            style={[
                styles.container,
                amount !== amountDelivered ? styles.warning : undefined,
            ]}>
            <View style={styles.row}>
                <View>
                    <KText bold text={`${product} ${productType}`} />
                    {description && description.length > 0 ? (
                        <KText text={description} />
                    ) : (
                        <KText text={''} />
                    )}
                    {exceeded && (
                        <KText
                            style={styles.red}
                            text={`${translate('loaderCarrying.exceeds')}`}
                        />
                    )}
                </View>
                <View style={styles.alignRight}>
                    <RoundButton
                        onPress={() =>
                            setAmountDelivered({
                                itemId: id,
                                carryItemId: orderId,
                                amountDelivered: amountDelivered - 1,
                            })
                        }
                        label={'-'}
                        disabled={amountDelivered === 0}
                    />
                    <KText
                        bold
                        fontSize={22}
                        text={`${amountDelivered}`}
                        style={styles.amount}
                    />
                    <RoundButton
                        label={'+'}
                        onPress={() =>
                            setAmountDelivered({
                                itemId: id,
                                carryItemId: orderId,
                                amountDelivered: amountDelivered + 1,
                            })
                        }
                        disabled={amountDelivered === amount}
                    />
                    <KText bold fontSize={22} text={`/${amount}`} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderColor: colors.primary,
        borderRadius: wp(10),
        borderWidth: 1,
        marginVertical: hp(5),
        paddingHorizontal: wp(10),
        paddingVertical: hp(8),
    },
    warning: {
        backgroundColor: colors.lemonChiffon,
    },
    alignRight: {
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: 'auto',
        marginRight: 0,
    },
    row: {
        flexDirection: 'row',
    },
    itemLabel: {
        lineHeight: hp(25),
    },
    roundButton: {
        alignItems: 'center',
        borderColor: colors.primary,
        borderRadius: hp(20),
        borderWidth: 1,
        height: hp(40),
        justifyContent: 'center',
        marginLeft: 'auto',
        marginRight: 0,
        width: hp(40),
    },
    disabledButton: {
        borderColor: colors.gray,
    },
    disabledText: {
        color: colors.gray,
    },
    amount: {
        marginHorizontal: wp(8),
    },
    red: {
        color: colors.red,
    },
})

export default ProductCard
