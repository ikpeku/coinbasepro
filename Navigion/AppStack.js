import React, { useEffect, useState } from 'react'


import { createDrawerNavigator } from '@react-navigation/drawer'
import { Feather, AntDesign, Entypo } from '@expo/vector-icons'
import {
  Admin,
  Chat,
  ChatList,
  ProfileScreen,
  SettingScreen,
  User,
  // Home as HomeScreen,
  // CryptoList,
} from '../sreens'
import { CustomDrawer } from '../components'
import TapNavigtion from './TapNavigtion'
import { auth, db } from '../firebase/firebaseConfig'


import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { doc, getDoc } from 'firebase/firestore'
import { Text, View } from 'react-native'
const StackAdminScreens = createNativeStackNavigator()
const StackChat = createNativeStackNavigator()

const StackAdminComponent = () => {
  return (
    <StackAdminScreens.Navigator>
      <StackAdminScreens.Screen
        name="userlist"
        component={Admin}
        options={{ headerShown: false }}
      />
      <StackAdminScreens.Screen
        name="user"
        component={User}
      // options={({route}) => ({
      //   title: `Deposit ${route.params?.title}`
      // })}
      />

    </StackAdminScreens.Navigator>
  )
}


const StackChatComponent = () => {
  return (
    <StackChat.Navigator>
      <StackChat.Screen
        name="chatList"
        component={ChatList}
        options={{ title: "Chats", headerTitleAlign: "center" }}
      />
      <StackChat.Screen
        name="chat"
        component={Chat}
        options={{ headerTitleAlign: "center" }}

      />

    </StackChat.Navigator>
  )
}



const Drawer = createDrawerNavigator()
const AppStack = () => {
  const [userData, setData] = useState(null)
  const user = auth.currentUser

  useEffect(() => {
    const docref = doc(db,
      "chatUser",
      "21vftV7EKUOu5kCAP11WyygDUFG2",
      "chatUsers",
      user.uid)
    const query = async () => {
      const ref = await getDoc(docref)
      // console.log("isDoc", ref.exists())
      if (ref.exists()) {
        setData(ref.data())
      }

    }
    query()
  }, [userData])



  const IconBadge = ({ color }) => {
    return (
      <View style={{ position: "relative" }}>
        <Entypo name="chat" size={24} color={color} />
        {userData?.isNewUserMessage > 0 && <View style={{ position: "absolute", right: 0, top: -6, backgroundColor: "orange", borderRadius: 10, padding: 1 }}>
          <Text style={{ color: "#fff" }}>{userData?.isNewUserMessage}</Text>
        </View>}
      </View>
    )
  }



  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      // initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        drawerLabelStyle: {
          marginLeft: -20,
          fontFamily: 'Nunito-Medium',
          fontSize: 18,
        },
        drawerActiveBackgroundColor: "#3376bc",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#3376bc"
      }}
    >
      <Drawer.Screen
        name="Home1"
        component={TapNavigtion}
        options={{
          drawerLabel: "Home",
          drawerIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),

        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color }) => (
            <AntDesign name="profile" size={24} color={color} />
          ),
        }}
      />
      {auth.currentUser.email === "yesiamadmin@coinbase.com" && <Drawer.Screen
        name="Admin"
        component={StackAdminComponent}

        options={{
          headerShown: false,
          drawerIcon: ({ color }) => (
            <AntDesign name="star" size={24} color={color} />
          ),

        }}
      />}

      {auth.currentUser.email === "yesiamadmin@coinbase.com" && <Drawer.Screen
        name="AdminChat"
        component={StackChatComponent}

        options={{
          headerShown: false,
          title: "Chat List",
          drawerIcon: ({ color }) => (
            <Entypo name="chat" size={24} color={color} />
          ),

        }}
      />}

      {auth.currentUser.email !== "yesiamadmin@coinbase.com" && <Drawer.Screen
        name="Chat"
        component={Chat}

        options={{
          headerShown: true,
          headerTitleAlign: "center",
          title: "Chat",
          drawerIcon: ({ color }) => (
            <IconBadge color={color} />
          ),

        }}
      />}


    </Drawer.Navigator>
  )
}

export default AppStack
