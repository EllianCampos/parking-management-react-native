import { Text, StyleSheet } from 'react-native'
import React from 'react'

const Label = ({ text }) => {
  return (
    <Text style={styles.text}>
      {text}
    </Text>
  )
}

const styles = StyleSheet.create({
    text: {
      fontWeight: 'bold',
      marginLeft: 10,
      marginTop: 10
    }
})

export default Label