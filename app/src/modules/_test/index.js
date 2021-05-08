import React, {useState} from 'react'
import {Text} from 'react-native'
import Button from 'src/components/fw/button'
import ScreenBase from 'src/components/fw/screen-base'
import storageService from 'src/services/storageService'

const TestScreen = () => {
    const [t, setT] = useState('0')

    return (
        <ScreenBase>
            <Text>{t}</Text>
            <Button onPress={() => setT('teste')} label={'change'} />
            <Button onPress={() => storageService.test.set(t)} label={'set'} />
            <Button
                onPress={async () => setT(await storageService.test.get())}
                label={'get'}
            />
        </ScreenBase>
    )
}

export default TestScreen
