import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

let CurrencyFormat = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
});

const TextInputCustom = ({ value, onchange, height = 40, readOnly=false, currency = false }) => {
  
  return (
    <TextInput
        style={[styles.input, { height }]}
        value={currency ? CurrencyFormat.format(value) : value}
        onChangeText={onchange}
        readOnly={readOnly}
    />
  )
}

const styles = StyleSheet.create({
    input: {
        margin: 12,
        borderWidth: 1,
        padding: 10,
    }
})

export default TextInputCustom