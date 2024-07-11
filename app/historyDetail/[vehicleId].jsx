import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useSQLiteContext } from 'expo-sqlite'
import PageTitle from '../../components/PageTitle'
import { currencyFormat } from '@/constants/currencyFormat.js'
import { numberFormat } from '@/constants/numberFormat.js'

const HistoryDetail = () => {

  const navigation = useNavigation()
  const db = useSQLiteContext()
  const { vehicleId } = useLocalSearchParams()

  const [vehicle, setVehicle] = useState([])

  const loadVehicle = async () => {
    const result = await db.getFirstAsync(`SELECT * FROM vehicles WHERE id = ?`, [vehicleId])
    setVehicle(result)
  }

  useEffect(() => {
    loadVehicle()
    navigation.setOptions({ headerTitle: `History ID: ${vehicleId}` })
  }, [])

  return (
    <ScrollView>
      <View style={styles.container}>
        <PageTitle text='Vehicle information' />

        <Text>
          <Text style={styles.title}>Vehicle registration plate: </Text>
          {vehicle.plate}
        </Text>

        <Text>
          <Text style={styles.title}>Vehicle type: </Text>
          {vehicle.type}
        </Text>

        <Text>
          <Text style={styles.title}>Observations: </Text>
          {vehicle.observations}
        </Text>

        <PageTitle text='Time' />

        <Text>
          <Text style={styles.title}>Entry: </Text>
          {vehicle.entryMonthText} {vehicle.entryDay}, {vehicle.entryYear} At {vehicle.entryHour}:{vehicle.entryMinute}
        </Text>

        <Text>
          <Text style={styles.title}>Exit: </Text> 
          {vehicle.exitMonthText} {vehicle.exitDay}, {vehicle.exitYear} at {vehicle.exitHour}:{vehicle.exitMinute}
        </Text>

        <Text>
          <Text style={styles.title}>Minutes stayed parked: </Text>
          {numberFormat.format(vehicle.minutesStayed)}
        </Text>

        <PageTitle text='Billing details' />

        <Text>
          <Text style={styles.title}>Price per minute: </Text>
          {vehicle.priceMinute}
        </Text>

        <Text>
          <Text style={styles.title}>Sub total: </Text>
          {currencyFormat.format(vehicle.subtotal)}
        </Text>

        <Text>
          <Text style={styles.title}>Taxes percentage: </Text>
          {vehicle.taxesPercentage}%
        </Text>

        <Text>
          <Text style={styles.title}>Taxes amount: </Text>
          {currencyFormat.format(vehicle.taxesAmount)}
        </Text>

        <Text>
          <Text style={styles.title}>Total: </Text>
          {currencyFormat.format(vehicle.total)}
        </Text>
        
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 30
  },
  title: {
    fontWeight: 'bold'
  }
})

export default HistoryDetail