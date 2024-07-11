import { View, Text, Image, StyleSheet } from 'react-native'

import logo from '@/assets/images/logo.png'
import { Link } from 'expo-router'
import { colors } from '../constants/colors'

const index = () => {
  return (
    <View>
      <Text style={styles.title}>Manage your parking easily</Text>
      <Image 
        source={logo}
        resizeMode='center'
        style={styles.image}
      /> 
      <Link 
        href='/home'
        style={styles.link}
      >
        Start
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: colors.appColorPrimary,
    color: 'white'
  },
  image: {
    width: '100',
    margin: 30,
    padding: 50
  }, 
  link: {
    backgroundColor: colors.appColorPrimary,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10
  }
})

export default index