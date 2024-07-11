import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import TextInputCustom from '../components/TextInputCustom'
import Label from '../components/Label'
import { Picker } from '@react-native-picker/picker'
import RNDateTimePicker from '@react-native-community/datetimepicker'
import Button from '../components/Button'
import { colors } from '../constants/colors'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import PageTitle from '../components/PageTitle'
import { months } from '../constants/months'

const enterVehicle = () => {

  const navigation = useNavigation()
  const { vehicleId } = useLocalSearchParams()
  const db = useSQLiteContext()

  const [now] = useState(new Date())
  const [priceMinute, setPriceMinute] = useState(1)
  const [minutesStayed, setMinutesStayed] = useState(0)
  const [subTotal, setSubTotal] = useState(0)
  const [taxesPercentaje, setTaxesPercentaje] = useState(13)
  const [taxesAmount, setTaxesAmount] = useState(0)
  const [total, setTotal] = useState(0)

  const [vehicle, setVehicle] = useState({
    plate: '',
    type: 'car',
    entryYear: now.getFullYear(),
    entryMonth: now.getMonth() + 1,
    entryMonthText: months.get(now.getMonth()),
    entryDay: now.getDate(),
    entryHours: now.getHours(),
    entryMinutes: now.getMinutes(),
    observations: '',
    exitYear: now.getFullYear(),
    exitMonth: now.getMonth + 1,
    exitMonthText: months.get(now.getMonth()),
    exitDay: now.getDate(),
    exitHour: now.getHours(),
    exitMinute: now.getMinutes()
  })

  const [askEntryDate, setAskEntryDate] = useState(false)
  const [askEntryTime, setAskEntryTime] = useState(false)
  const [showCheckOut, setShowCheckout] = useState(false)
  const [askExitDate, setAskExitDate] = useState(false)
  const [askExitTime, setAskExitTime] = useState(false)

  const searchVehicleData = async () => {
    const vehicleDbRegister = await db.getFirstAsync(
      'SELECT * FROM vehicles WHERE id = ?', 
      [vehicleId]
    )

    setVehicle({
      plate: vehicleDbRegister.plate,
      type: vehicleDbRegister.type,
      entryYear: vehicleDbRegister.entryYear,
      entryMonth: vehicleDbRegister.entryMonth,
      entryMonthText: vehicleDbRegister.entryMonthText,
      entryDay: vehicleDbRegister.entryDay,
      entryHours: vehicleDbRegister.entryHour,
      entryMinutes: vehicleDbRegister.entryMinute,
      observations: vehicleDbRegister.observations,
      exitYear: vehicleDbRegister.exitYear === null ? now.getFullYear() : vehicleDbRegister.exitYear,
      exitMonth: vehicleDbRegister.exitMonth === null ? now.getMonth() + 1 : vehicleDbRegister.exitMonth,
      exitMonthText: vehicleDbRegister.exitMonthText === null ? months.get(now.getMonth()) : vehicleDbRegister.exitMonthText,
      exitDay: vehicleDbRegister.exitDay === null ? now.getDate() : vehicleDbRegister.exitDay,
      exitHour: vehicleDbRegister.exitHour === null ? now.getHours() : vehicleDbRegister.exitHour,
      exitMinute: vehicleDbRegister.exitMinute === null ? now.getMinutes() : vehicleDbRegister.exitMinute
    })
  }

  const handleSubmit = async () => {
    if (vehicle.plate === '') return Alert.alert('Please fill in the plate')

    try {
      if (vehicleId == undefined) {
        const result = await db.runAsync(`
          INSERT INTO vehicles (plate, type, entryYear, entryMonth, entryMonthText, entryDay, entryHour, 
          entryMinute, observations, hasExited)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        `,[
            vehicle.plate,
            vehicle.type, 
            vehicle.entryYear,
            vehicle.entryMonth, 
            vehicle.entryMonthText,
            vehicle.entryDay, 
            vehicle.entryHours,
            vehicle.entryMinutes,
            vehicle.observations
          ]
        )
      } else {
        await db.runAsync(`
          UPDATE vehicles SET observations = ? WHERE id = ?
        `,[
          vehicle.observations,
          vehicleId
        ])
      }
       
      router.replace('/home')
    } catch (error) {
      console.log(error)
      Alert.alert(error)
    }    
  }

  const getPriceMinute = async () => {
    const resultPriceMinute = await db.getFirstAsync("SELECT value FROM settings WHERE key = 'priceMinute'")
    return resultPriceMinute.value
  }

  const checkOut = async () => {
    if (!showCheckOut) {
      const pricMin = await getPriceMinute()
      setPriceMinute(pricMin)

      const entryDateTime = new Date(vehicle.entryYear, vehicle.entryMonth - 1, vehicle.entryDay, vehicle.entryHours, vehicle.entryMinutes)
      const exitDateTime = new Date()

      const diff = exitDateTime.getTime() - entryDateTime.getTime()
      const stayedMinutes = parseInt(diff / (1000*60))

      const subTot = stayedMinutes * pricMin
      const taxAmo = subTot * (taxesPercentaje / 100)
      const tot = subTot + taxAmo

      setShowCheckout(true)
      setMinutesStayed(stayedMinutes.toString())
      setSubTotal(subTot)
      setTaxesAmount(taxAmo)
      setTotal(tot)
      return 
    }

    try {
      const result = await db.runAsync(`
        UPDATE vehicles SET hasExited = 1, exitYear = ?, exitMonth = ?, exitMonthText = ?,
        exitDay = ?, exitHour = ?, exitMinute = ?,
        priceMinute = ?, minutesStayed = ?, subtotal = ?, taxesPercentage = ?,
        taxesAmount = ?, total = ? WHERE id = ?
      `,[
        vehicle.exitYear,
        vehicle.exitMonth,
        vehicle.exitMonthText,
        vehicle.exitDay,
        vehicle.exitHour, 
        vehicle.exitMinute,
        priceMinute,
        minutesStayed,
        subTotal,
        taxesPercentaje,
        taxesAmount,
        total,
        vehicleId
      ])
      router.replace('/home')
    } catch (error) {
      console.log(error)
      Alert.alert(error)
    }
  }

  useEffect(() => {
    navigation.setOptions({ headerTitle: vehicleId == undefined ? 'Enter Vehicle' : 'Manage Vehicle' })
    if (vehicleId !== undefined) {
      searchVehicleData()
    }
  }, [])

  return (
    <ScrollView>
      
      <Label text='Vehicle registration plate' />
      <TextInputCustom 
        value={vehicle.plate} 
        onchange={value => setVehicle({...vehicle, plate: value})} 
        readOnly={vehicleId === undefined ? false : true}
      />

      <Label text='Vehicle type' />
      <View style={[styles.borderStyle, { height: 70 }]}>
        <Picker   
          selectedValue={vehicle.type}
          onValueChange={(itemValue) => 
            setVehicle({...vehicle, type: itemValue})
          }
          enabled={vehicleId !== undefined ? false : true}
        >
          <Picker.Item label="Car" value="car" />
          <Picker.Item label="Bike" value="bike" />
        </Picker>
      </View>
      

      <Label text='Entry date' />
      <Pressable onPress={() => setAskEntryDate(true)} style={styles.borderStyle}>
        <Text>{vehicle.entryMonthText} {vehicle.entryDay}, {vehicle.entryYear}</Text>
      </Pressable>
      {(askEntryDate && vehicleId === undefined) && (
        <RNDateTimePicker 
          mode='date' 
          value={new Date(vehicle.entryYear, vehicle.entryMonth - 1, vehicle.entryDay)}          
          onChange={(event, date) => {
            setAskEntryDate(false)
            setVehicle({...vehicle, entryYear: date.getFullYear(), entryMonth: date.getMonth() + 1, entryMonthText: months.get(date.getMonth()), entryDay: date.getDate()})  
          }}
        />
      )}

      <Label text='Entry time' />
      <Pressable onPress={() => setAskEntryTime(true)} style={styles.borderStyle}>
        <Text>
          {vehicle.entryHours.toString().padStart(2, '0')}
          :
          {vehicle.entryMinutes.toString().padStart(2, '0')}
        </Text>
      </Pressable>
      {(askEntryTime && vehicleId === undefined) && (
        <RNDateTimePicker 
          mode='time' 
          value={new Date(2024, 7, 5, vehicle.entryHours, vehicle.entryMinutes)}  
          is24Hour={true}         
          onChange={(event, date) => {
            setAskEntryTime(false)
            setVehicle({...vehicle, entryHours: date.getHours(), entryMinutes: date.getMinutes().toString()})
          }}
        />
      )}

      <Label text='Observations' />
      <TextInputCustom 
        value={vehicle.observations}
        onchange={(value) => setVehicle({...vehicle, observations: value})}
        height={100}
      />

      {!showCheckOut && (
        <Button 
          text={vehicleId === undefined ? 'Save entry' : 'Save observations'} 
          bgColor={colors.success} 
          fontColor={colors.light} 
          onPress={handleSubmit}
        />
      )}      

      {showCheckOut && (
        <>
          <Label text='Exit date' />
          <Pressable onPress={() => setAskExitDate(true)} style={styles.borderStyle}>
            <Text>{vehicle.exitMonthText} {vehicle.exitDay}, {vehicle.exitYear}</Text>
          </Pressable>
          {askExitDate && (
            <RNDateTimePicker 
              mode='date' 
              value={new Date(vehicle.exitYear, vehicle.exitMonth - 1, vehicle.exitDay)}          
              onChange={(event, date) => {
                setAskExitDate(false)
                setVehicle({...vehicle, exitYear: date.getFullYear(), exitMonth: date.getMonth() + 1, exitMonthText: months.get(date.getMonth()), exitDay: date.getDate()})  
              }}
            />
          )}

          <Label text='Exit time' />
          <Pressable onPress={() => setAskExitTime(true)} style={styles.borderStyle}>
            <Text>
              {vehicle.exitHour.toString().padStart(2, '0')}
              :
              {vehicle.exitMinute.toString().padStart(2, '0')}
            </Text>
          </Pressable>
          {askExitTime && (
            <RNDateTimePicker 
              mode='time' 
              value={new Date(null, null, null, vehicle.entryHours, vehicle.entryMinutes)}  
              is24Hour={true}         
              onChange={(event, date) => {
                setAskExitTime(false)
                setVehicle({...vehicle, exitHour: date.getHours(), exitMinute: date.getMinutes().toString()})
              }}
            />
          )}

          <PageTitle text='Billing details' />

          <Label text='Price per minute' />
          <TextInputCustom value={priceMinute} readOnly={true} />

          <Label text='Minuts stayed' />
          <TextInputCustom value={minutesStayed.toString()} readOnly={true} />

          <Label text='Sub total' />
          <TextInputCustom value={subTotal.toString()} readOnly={true} currency={true} />

          <Label text='Taxes percentaje' />
          <TextInputCustom value={taxesPercentaje.toString()} readOnly={true} />

          <Label text='Taxes amount' />
          <TextInputCustom value={taxesAmount.toString()} readOnly={true} currency={true} />

          <Label text='Total' />
          <TextInputCustom value={total.toString()} readOnly={true} currency={true} />

        </>
      )}

      {vehicleId !== undefined && (
        <Button 
          text='Check out'
          bgColor={colors.warning}
          onPress={checkOut}
        />
      )}
      
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  borderStyle: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
})

export default enterVehicle