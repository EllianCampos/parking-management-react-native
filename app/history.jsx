import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import HistoryCard from '../components/HistoryCard'

const history = () => {

  const db = useSQLiteContext()

  const [vehiclesHistory, setVehiclesHistory] = useState([])

  const loadHistory = async () => {
    const result = await db.getAllAsync('SELECT * FROM vehicles WHERE hasExited = 1 ORDER BY id DESC')
    setVehiclesHistory(result)
  }

  useEffect(() => {
    loadHistory()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <FlatList 
        data={vehiclesHistory}
        renderItem={({item}) => <HistoryCard item={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default history