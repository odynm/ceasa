import React, {useState, useEffect} from 'react'
import {
    View,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    TextInput as RNTextInput,
} from 'react-native'
import {SvgXml} from 'react-native-svg'
import {translate} from 'src/i18n/translate'
import styles from './styles'
import Picker from '../picker'
import Modal from 'react-native-modal'
import KText from 'src/components/fw/ktext'
import svgSearch from 'res/svgs/v13/svgSearch.svg'
import KeyboardService from 'src/services/keyboardService'

const RecentRegisterPicker = ({
    list,
    label,
    loading,
    disabled,
    listLabel,
    selectedId,
    listRecent,
    errorMessage,
    setSelectedId,
    labelNotRegistered,
    notRegisteredPress,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchString, setSearchString] = useState('')
    const [searchStringUpper, setSearchStringUpper] = useState('')
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

    useEffect(() => {
        KeyboardService.subscribeHide(onKeyboardHide)
    }, [])

    const setSelected = (item) => {
        setSelectedId(item.id)
        setIsOpen(false)
    }

    const onKeyboardHide = () => {
        setIsKeyboardOpen(false)
    }

    const onOpenKeyboard = () => {
        setIsKeyboardOpen(true)
    }

    const onCloseKeyboard = () => {
        setIsKeyboardOpen(false)
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
                <KeyboardAvoidingView
                    style={
                        isKeyboardOpen
                            ? {
                                  ...styles.openContainer,
                                  ...styles.containerSmall,
                              }
                            : styles.openContainer
                    }>
                    {labelNotRegistered?.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                setIsOpen(false)
                                notRegisteredPress()
                            }}>
                            <KText
                                bold
                                link
                                text={labelNotRegistered}
                                style={styles.labelNotRegistered}
                            />
                        </TouchableOpacity>
                    )}
                    <ScrollView
                        style={styles.scrollView}
                        persistentScrollbar={true}
                        keyboardShouldPersistTaps={'handled'}>
                        {listRecent && listRecent.length > 0 && (
                            <>
                                <KText
                                    bold
                                    text={translate(
                                        'fw.recentRegisterPicker.recents',
                                    )}
                                />
                                <View style={styles.line} />
                                <View style={styles.listView}>
                                    {listRecent.map((x) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelected(x)
                                                setSearchString('')
                                                setSearchStringUpper('')
                                            }}
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
                            </>
                        )}
                        <KText bold text={listLabel} />
                        <View style={styles.line} />
                        <View style={styles.searchView}>
                            <SvgXml style={styles.searchIcon} xml={svgSearch} />
                            <RNTextInput
                                value={searchString}
                                onChangeText={(t) => {
                                    setSearchString(t)
                                    setSearchStringUpper(t.toUpperCase())
                                }}
                                onBlur={onCloseKeyboard}
                                onFocus={onOpenKeyboard}
                                placeholder={translate(
                                    'fw.recentRegisterPicker.search',
                                )}
                                style={styles.searchText}
                            />
                        </View>
                        <View style={styles.listView}>
                            {searchString.length > 0
                                ? list
                                      .filter((x) =>
                                          x.name
                                              .toUpperCase()
                                              .startsWith(searchStringUpper),
                                      )
                                      .map((x) => (
                                          <TouchableOpacity
                                              onPress={() => {
                                                  setSelected(x)
                                                  setSearchString('')
                                                  setSearchStringUpper('')
                                              }}
                                              key={x.id}>
                                              <View style={styles.listItemCard}>
                                                  <KText
                                                      key={x.id}
                                                      bold
                                                      style={
                                                          styles.listItemText
                                                      }
                                                      text={x.name}
                                                  />
                                              </View>
                                          </TouchableOpacity>
                                      ))
                                : list.map((x) => (
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

export default RecentRegisterPicker
