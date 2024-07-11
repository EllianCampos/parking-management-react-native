import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { colors } from '../constants/colors'

const HistoryCard = ({ item }) => {
  return (
    <Link href={`/historyDetail/${item.id}`} style={styles.container}>
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
          <Text style={styles.label}>Entry: </Text> 
          {item.entryMonthText} {item.entryDay}, {item.entryYear} at {item.entryHour.toString().padStart(2, '0')}:{item.entryMinute.toString().padStart(2, '0')}
        </Text>

        <Text>
          <Text style={styles.label}>Exit: </Text> 
          {item.exitMonthText} {item.exitDay}, {item.exitYear} at {item.exitHour.toString().padStart(2, '0')}:{item.exitMinute.toString().padStart(2, '0')}
        </Text>

        <Text>
          <Text style={styles.label}>Minuts stayed: </Text> 
          {item.minutesStayed}
        </Text>

        <Text>
          <Text style={styles.label}>Subtotal: </Text> 
          {item.subtotal}
        </Text>

        <Text>
          <Text style={styles.label}>Total IVA: </Text> 
          {item.total}
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
export default HistoryCard