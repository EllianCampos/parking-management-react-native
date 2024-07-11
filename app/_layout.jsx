import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
import { SQLiteProvider } from 'expo-sqlite'
import { migrateDbIfNeeded } from '../database/database'

const Layout = () => {
  return (
    <SafeAreaView  style={styles.container}>
      
      <SQLiteProvider databaseName='parkingstorage.db' onInit={migrateDbIfNeeded} >

        <Stack
          screenOptions={{
            headerTitleAlign: 'center'
          }}
        >
          <Stack.Screen name='index' options={{ headerShown: false }} /> 
          <Stack.Screen name='home' options={{ headerShown: false }} /> 
          <Stack.Screen name='history' options={{ headerTitle: 'History' }} />
          <Stack.Screen name='settings' options={{ headerTitle: 'Settings' }} />
        </Stack>

      </SQLiteProvider>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default Layout