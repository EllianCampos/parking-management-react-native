import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import Label from '../components/Label';
import TextInputCustom from '../components/TextInputCustom';
import Button from '../components/Button';
import { colors } from '../constants/colors';
import { useSQLiteContext } from 'expo-sqlite';

const settings = () => {

  const db = useSQLiteContext()

  const [priceMinute, setPriceMinute] = useState(0)

  const laodSettings = async () => {
    const resultPriceMinute = await db.getFirstAsync("SELECT key, value FROM settings WHERE key = 'priceMinute'")
    setPriceMinute(resultPriceMinute.value)
  }

  const handleSave = async () => {
    try {
      await db.runAsync(`
        UPDATE settings SET value = ? WHERE key = 'priceMinute'
      `, [priceMinute])
      Alert.alert('Settings successfully updated')
    } catch (error) {
      Alert.error('There was an error updating the settings')
    }    
  }

  useEffect(() => {
    laodSettings()
  }, [])

  return (
    <View>

      <Label text='Minute price' />
      <TextInputCustom value={priceMinute} onchange={value => setPriceMinute(value)}  />

      <Button 
        text='Save changes' 
        bgColor={colors.success} 
        fontColor={colors.light} 
        onPress={handleSave}
      />

      {/* <Button 
        text='Delete all app data' 
        bgColor={colors.danger} 
        fontColor={colors.light} 
      /> */}

    </View>
  )
}

export default settings