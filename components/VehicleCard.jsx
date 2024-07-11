import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { colors } from '../constants/colors'

const VehicleCard = ({ item }) => {
  return (
    <Link href={`/vehicle/${item.id}`} style={styles.container}>
      <View>

        <Text>
          <Text style={styles.label}>ID: </Text> 
          {item.id}
        </Text>

        <Text>
          <Text style={styles.label}>Plate: </Text> 
          {item.plate}
        </Text>

        <Text>
          <Text style={styles.label}>Type: </Text> 
          {item.type}
        </Text>

        <Text>
          <Text style={styles.label}>Entry: </Text> 
          {item.entryMonthText} {item.entryDay}, {item.entryYear + ' '} 
          at {item.entryHour.toString().padStart(2, '0')}:{item.entryMinute.toString().padStart(2, '0')}
        </Text>

        <Text>
          <Text style={styles.label}>Observations: </Text> 
          {item.observations}
        </Text>

      </View>      
    </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    marginHorizontal: 10,
    marginVertical: 3,
    padding: 5,
    backgroundColor: colors.secondary
  }, 
  label: {
    fontWeight: 'bold'
  }
})

export default VehicleCard