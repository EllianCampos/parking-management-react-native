import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const PageTitle = ({ text }) => {
  return (
    <View>
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
      fontWeight: 'bold',
      textAlign: 'center',
      fontSize: 18,
      marginTop: 18
  }
})

export default PageTitle