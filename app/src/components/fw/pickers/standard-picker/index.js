import React, {useState} from 'react'
import {
    View,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native'
import styles from './styles'
import Picker from '../picker'
import Modal from 'react-native-modal'
import KText from 'src/components/fw/ktext'

const StandardPicker = ({
    list,
    label,
    loading,
    disabled,
    listLabel,
    selectedId,
    errorMessage,
    setSelectedId,
}) => {
    const [isOpen, setIsOpen] = useState(false)

    const setSelected = (item) => {
        setSelectedId(item.id)
        setIsOpen(false)
    }

    return (
        <>
            <Picker
                label={label}
                loading={loading}
                disabled={disabled}
                errorMessage={errorMessage}
                selected={list && list.find((x) => x.id === selectedId)?.name}
                onPress={() => setIsOpen(true)}
            />
            <Modal
                isVisible={isOpen}
                onRequestClose={() => setIsOpen(false)}
                onBackdropPress={() => setIsOpen(false)}
                backdropOpacity={0.4}>
                <KeyboardAvoidingView style={styles.openContainer}>
                    <ScrollView
                        style={styles.scrollView}
                        persistentScrollbar={true}
                        keyboardShouldPersistTaps={'handled'}>
                        <KText bold text={listLabel} />
                        <View style={styles.line} />
                        <View style={styles.listView}>
                            {list.map((x) => (
                                <TouchableOpacity
                                    onPress={() => setSelected(x)}
                                    key={x.id}>
                                    <View style={styles.listItemCard}>
                                        <KText
                                            key={x.id}
                                            bold
                                            style={styles.listItemText}
                                            text={x.name}
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </>
    )
}

export default StandardPicker
