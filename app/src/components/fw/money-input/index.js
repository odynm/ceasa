import React, {useEffect} from 'react'
import {hp, fv, wp} from 'src/utils/screen'
import {View, StyleSheet} from 'react-native'
import {TextInputMask} from 'react-native-masked-text'
import KText from '../ktext'
import colors from 'src/constants/colors'
import Error from 'src/components/fw/error'
import MoneyService from 'src/services/moneyService'

const MoneyInput = ({label, value, setValue, errorMessage}) => {
    useEffect(() => {
        return () => {
            setValue('0,00')
        }
    }, [])

    return (
        <View>
            <View style={styles.row}>
                <KText bold text={label} />
                <View style={styles.right}>
                    <KText bold text={MoneyService.getCurrency().text} />
                    <View style={styles.inputContainer}>
                        <TextInputMask
                            maxLength={8}
                            value={value}
                            type={'money'}
                            onChangeText={setValue}
                            style={styles.textInput}
                            options={{
                                precision: 2,
                                separator: ',',
                                delimiter: '.',
                                unit: '',
                                suffixUnit: '',
                            }}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.error}>
                <Error text={errorMessage} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        marginTop: hp(15),
        flexDirection: 'row',
        width: '100%',
    },
    right: {
        flexDirection: 'row',
        marginLeft: 'auto',
        marginRight: 0,
    },
    error: {
        marginLeft: 'auto',
        marginRight: 0,
        marginTop: -hp(15),
    },
    inputContainer: {
        borderBottomColor: colors.gray,
        borderBottomWidth: 1,
        bottom: hp(15),
    },
    textInput: {
        fontSize: fv(16),
        textAlign: 'right',
        padding: 0,
        paddingRight: hp(5),
        bottom: hp(-5),
        marginLeft: wp(10),
        width: wp(60),
    },
})

export default MoneyInput
