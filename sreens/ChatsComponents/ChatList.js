import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useMemo } from 'react'
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
    const [userData, setUserData] = useState(0)

    useEffect(() => {

        (async () => {
            const docref = doc(
                db,
                "chatUser",
                "21vftV7EKUOu5kCAP11WyygDUFG2",
                "chatUsers",
                item?.id
            )

            const ref = await getDoc(docref)
            if (ref.exists()) {
                setUserData(ref.data())
            }
        })()


    }, [userData])


    return (
        <TouchableOpacity onPress={() => navigation.navigate("chat", { id: item?.id })} style={styles.container}>
            <View style={styles.rightContainer}>
                <View>
                    <Text style={styles.name}>{item.users.Name}</Text>
                </View>

                {userData?.isNewAdminMessage > 0 && <View style={styles.badge}>
                    <Text style={{ textAlign: "center", color: "#fff" }}>{userData?.isNewAdminMessage}</Text>
                </View>}
            </View>

        </TouchableOpacity>
    )
}

const ChatList = ({ navigation }) => {

    console.log("list")

    const [users, setUsers] = useState([]);

    useEffect(() => {



        (async () => {


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

        })()


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
        alignItems: "center",
        flexDirection: "row",
        marginLeft: 10,
    },
    name: {
        fontWeight: "bold",
        fontSize: 18,
        marginBottom: 3,
    },
    badge: {
        backgroundColor: "#3376bc",
        width: 20,
        aspectRatio: 1,
        borderRadius: 7,
        justifyContent: "center",
        marginLeft: 10,

    }

})
export default ChatList