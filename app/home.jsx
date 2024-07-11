import { View, Text, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import ButtonLink from '../components/ButtonLink'
import { colors } from '../constants/colors'
import PageTitle from '../components/PageTitle'
import { useSQLiteContext } from 'expo-sqlite'
import VehicleCard from '../components/VehicleCard'

const home = () => {

  const db = useSQLiteContext()

  const [parkedVehicles, setParkedVehicles] = useState([])

  const loadParkedVehicles = async () => {
    const result = await db.getAllAsync('SELECT * FROM vehicles WHERE hasExited = 0 ORDER BY id DESC')
    setParkedVehicles(result)
  }

  useEffect(() => {
    loadParkedVehicles()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <View>
        <PageTitle text='Parking' />
        <ButtonLink to='/enterVehicle' text='Enter a vehicule' color={colors.success} />
        <ButtonLink to='/history' text='History' color={colors.primary} />
        <ButtonLink to='/settings' text='Settings' color={colors.secondary} />
        <PageTitle text='Parked Vehicles' />
      </View>
      <FlatList 
        data={parkedVehicles}
        renderItem={({item}) => <VehicleCard item={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default home