import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
// import { Image } from 'react-native'
import { auth, db } from '../../firebase/firebaseConfig'
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";




const Item = ({ navigation, item }) => {

    // console.log(item.id)
    return (
        <TouchableOpacity onPress={() => navigation.navigate("chat", { id: item?.id })} style={styles.container}>
            {/* <Image source={{ uri: "https://img.freepik.com/free-photo/white-t-shirts-with-copy-space-gray-background_53876-104920.jpg?w=740&t=st=1684890865~exp=1684891465~hmac=160705343d38c315ee4bf474cc5ed1d97ccb42212aac2e3cfd35b93d8297020e" }} style={styles.image} />
            <View style={styles.badgeContainer}>
                <Text style={styles.bagdgeText}>4</Text>
            </View> */}
            <View style={styles.rightContainer}>
                <View style={styles.row}>
                    <Text style={styles.name}>{item.users.Name}</Text>
                    {/* <Text style={styles.text}>11:34</Text> */}
                </View>
                {/* <Text numberOfLines={1} style={styles.text}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed nisi aliquid alias fugiat culpa iusto omnis, maxime inventore impedit corporis, modi a quia blanditiis numquam! Quis porro officia totam reiciendis.</Text> */}
            </View>

        </TouchableOpacity>
    )
}

const ChatList = ({ navigation }) => {



    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {


            try {

                const userRef = collection(db, "users")

                const q = query(userRef)
                const querySnapShot = await getDocs(q)



                let AllUsers = []

                querySnapShot.forEach((doc) => {
                    return AllUsers.push({ id: doc.id, users: doc.data() })
                })

                setUsers(AllUsers)

            } catch (error) {
                console.log(error)

            }

        }

        fetchUser()
    }, [])






    return (
        <View style={styles.root}>

            <FlatList
                data={users}
                renderItem={({ item }) => <Item item={item} navigation={navigation} />}
                showsVerticalScrollIndicator={false}

            />

        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        // padding: 10,
        backgroundColor: "white"
    },
    container: {
        flexDirection: "row",
        padding: 10,
        position: "relative",

    },
    image: {
        width: 50,
        aspectRatio: 1,
        borderRadius: 30,
        margrinRight: 10,
    },
    badgeContainer: {
        width: 20,
        aspectRatio: 1,
        backgroundColor: "#3376bc",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "white",
        position: "absolute",
        left: 45,
        top: 10
    },
    bagdgeText: {
        color: "white",
        fontSize: 12
    },
    rightContainer: {
        flex: 1,
        justifyContent: "center",
        marginLeft: 10
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    name: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 3,
    },
    text: {

    }

})
export default ChatList