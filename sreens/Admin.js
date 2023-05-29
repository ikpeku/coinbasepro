import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';

import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import { FlashList } from '@shopify/flash-list';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const Admin = ({ navigation }) => {
  const [users, setUsers] = useState(null)
  const [isLoading, setIsLoding] = useState(false)



  useEffect(() => {
    const fetchUser = async () => {
      setIsLoding(true)

      try {

        const userRef = collection(db, "users")

        const q = query(userRef)

        const querySnapShot = await getDocs(q)

        let AllUsers = []

        querySnapShot.forEach((doc) => {

          return AllUsers.push({ id: doc.id, users: doc.data() })
        })

        setUsers(AllUsers)

        setIsLoding(false)

      } catch (error) { }

    }

    fetchUser()
  }, [])


  const onDeletePress = (item) => {

    const { id, users } = item


    Alert.alert('Delete user', `do you want to delete ${users.Name}`, [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes', onPress: () => deleted(id)


      },
    ]);
  }

  const deleted = async (id) => {


    const userRef = doc(db, "users", id)

    try {
      await deleteDoc(userRef)
      setUsers(users.filter(user => user.id !== id))
    } catch (error) {
      Alert.alert("Delete user", "operation failed try again")
      // console.log(error.message)
    }
  }




  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={'large'} color="#3376bc" />
      </View>
    )
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>


      <View>
        <Text style={{ textAlign: "center", marginTop: 20, fontWeight: "bold", fontSize: 25, fontFamily: 'Nunito-Medium', color: "#3376bc" }}>Dashboard</Text>
      </View>


      <View>
        <Text style={{ fontWeight: "bold", fontSize: 20, fontFamily: 'Nunito-Medium', color: "#3376bc", borderBottomWidth: 1, paddingHorizontal: 10 }}>Users</Text>

      </View>

      <View style={{ flex: 1 }}>
        <FlashList
          estimatedItemSize={10}
          // keyExtractor={(item) => item.id}
          data={users}
          renderItem={({ item }) => (
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 3, marginHorizontal: 10, alignItems: "center", borderWidth: 1, paddingLeft: 4 }} >

              <Pressable onPress={() => navigation.navigate("user", { user: item.users, id: item.id })}>
                <Text style={{ color: "#3376bc", fontSize: 22, fontWeight: "bold" }}>{item.id === "21vftV7EKUOu5kCAP11WyygDUFG2" ? "Admin" : item.users.Name}</Text>
              </Pressable>

              <Button disabled={item.id === "21vftV7EKUOu5kCAP11WyygDUFG2"} onPress={() => onDeletePress(item)} title='delete' />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  )
}

export default Admin