import React from 'react'
import {wp, hp} from 'src/utils/screen'
import {translate} from 'src/i18n/translate'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import colors from 'src/constants/colors'
import KText from 'src/components/fw/ktext'
import MoneyService from 'src/services/moneyService'

const ItemCardHome = ({
    sold,
    amount,
    product,
    costPrice,
    handlePress,
    productType,
    description,
    totalEarned,
    liquidEarned,
    startingTotalItems,
}) => {
    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.container}>
                <View style={styles.row}>
                    <KText bold text={`${product} ${productType}`} />
                </View>
                {description && description.length > 0 ? (
                    <View style={styles.row}>
                        <KText text={description} />
                    </View>
                ) : (
                    undefined
                )}
                <View style={styles.row}>
                    <KText
                        style={styles.itemLabel}
                        fontSize={14}
                        text={`${translate('home.costPrice')} `}
                    />
                    <KText
                        bold
                        style={styles.alignRight}
                        text={`${MoneyService.getCurrency().text} ${
                            costPrice.text
                        } `}
                    />
                </View>
                <View style={styles.rowSpaceBetween}>
                    <View style={styles.row}>
                        <KText
                            style={styles.itemLabel}
                            fontSize={14}
                            text={`${translate('home.startingTotal')}`}
                        />
                        <KText bold text={`${startingTotalItems}`} />
                    </View>
                    <View style={styles.row}>
                        <KText
                            style={styles.itemLabel}
                            fontSize={14}
                            text={`${translate('home.sold')}`}
                        />
                        <KText bold text={`${sold}`} />
                    </View>
                    <View style={styles.row}>
                        <KText
                            style={styles.itemLabel}
                            fontSize={14}
                            text={`${translate('home.inStorage')}`}
                        />
                        <KText bold text={`${amount}`} />
                    </View>
                </View>
                <View style={styles.rowSpaceBetween}>
                    <View style={styles.row}>
                        <KText
                            style={styles.itemLabel}
                            fontSize={14}
                            text={`${translate('home.netTotal')}`}
                        />
                        <KText
                            bold
                            text={`${MoneyService.getCurrency().text} ${
                                totalEarned.text
                            }`}
                        />
                    </View>
                    <View style={styles.row}>
                        <KText
                            style={styles.itemLabel}
                            fontSize={14}
                            text={`${translate('home.profit')}`}
                        />
                        <KText
                            bold
                            text={`${MoneyService.getCurrency().text} ${
                                liquidEarned.text
                            }`}
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderColor: colors.primary,
        borderRadius: wp(10),
        borderWidth: 1,
        marginBottom: hp(10),
        paddingHorizontal: wp(10),
        paddingVertical: hp(8),
    },
    row: {
        flexDirection: 'row',
    },
    rowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    alignRight: {
        flexDirection: 'row',
        marginLeft: 'auto',
        marginRight: 0,
    },
    itemLabel: {
        lineHeight: hp(25),
    },
})

export default ItemCardHome
