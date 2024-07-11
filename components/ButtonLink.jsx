import { StyleSheet } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const ButtonLink = ({ to, text, color }) => {
  return (
    <Link href={to} style={[styles.link, { backgroundColor: color }]}>
        {text}
    </Link>
  )
}

const styles = StyleSheet.create({
    link: {
        color: 'white',
        fontWeight: '400',
        textAlign: 'center',
        margin: 10,
        padding: 10,
        borderRadius: 8
    }
})

export default ButtonLink