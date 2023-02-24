import React, { useEffect, useState } from 'react';
import {View, Text,  Button, ActivityIndicator} from 'react-native';
import { SafeAreaView ,} from 'react-native-safe-area-context';

import {collection, query, getDocs} from "firebase/firestore"
import {db} from "../firebase/firebaseConfig"
import { FlashList } from '@shopify/flash-list';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const Admin = ({navigation}) => {
  const [users, setUsers] = useState(null)
  const [isLoading, setIsLoding] = useState(false)

  useEffect(() => {
    const fetchUser = async() => {
      setIsLoding(true)

      try {

        const userRef = collection(db, "users")

        const q = query(userRef)

        const querySnapShot = await getDocs(q)

        let AllUsers = []

        querySnapShot.forEach((doc) => {
        
          return AllUsers.push({id: doc.id, users: doc.data()})
        })

        setUsers(AllUsers)

        setIsLoding(false)
        
      } catch (error) {
        
      }

    }

    fetchUser()
  }, [])


   if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <ActivityIndicator size={'large'}  color="#3376bc" />
      </View>
    )
  }


return(
  <SafeAreaView style={{flex: 1}}>
      
    
    <View>
    <Text style={{textAlign: "center", marginTop: 20, fontWeight: "bold", fontSize: 25, fontFamily: 'Nunito-Medium', color:"#3376bc"}}>Dashboard</Text>
    </View>


    <View>
      <Text style={{fontWeight: "bold", fontSize: 20, fontFamily: 'Nunito-Medium', color:"#3376bc", borderBottomWidth: 1}}>Users</Text>
      {/* <Button title="goto user" onPress={() => navigation.navigate("user")} /> */}

    </View>

    <View style={{flex: 1}}>
    <FlashList
      estimatedItemSize={10}
        // keyExtractor={(item) => item.id}
        data={users}
        renderItem={({ item }) => (
          <View>
            <Pressable onPress={() => navigation.navigate("user", {user: item.users, id: item.id})}>
            <Text style={{color: "#3376bc", margin: 5, fontSize: 22, fontWeight: "bold"}}>{item.users.Name}</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  </SafeAreaView>
)
}

export default Admin