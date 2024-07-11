import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors'

const Button = ({ onPress, text, bgColor = colors.secondary, fontColor = colors.dark }) => {
  return (
    <TouchableOpacity 
        style={[styles.button, { backgroundColor: bgColor }]}
        onPress={onPress}
    >
        <Text style={[styles.buttonText, { color: fontColor }]}>
            {text}
        </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        margin: 10,
        borderRadius: 8
    },
    buttonText: {
        fontWeight: 'semibold'
    }
})

export default Button