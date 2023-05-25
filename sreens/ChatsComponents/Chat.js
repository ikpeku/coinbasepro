import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TextInput, KeyboardAvoidingView } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../firebase/firebaseConfig'
import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
} from "firebase/firestore";
import moment from 'moment';



const Chat = ({ route }) => {


    const [chatMessage, setChatMessage] = useState("");

    const [allMessages, setAllMessages] = useState([]);

    const user = auth.currentUser;

    const userId = route?.params?.id
    useEffect(() => {
        if (userId === undefined) {

            const unsub = onSnapshot(
                query(
                    collection(
                        db,
                        "chat",
                        "21vftV7EKUOu5kCAP11WyygDUFG2",
                        "chatUsers",
                        user?.uid,
                        "messages"
                    ),
                    orderBy("timestamp")
                ),
                (snapshot) => {
                    setAllMessages(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            messages: doc.data(),
                        }))
                    );
                }
            );
            return unsub;
        } else {
            const unsub = onSnapshot(
                query(
                    collection(
                        db,
                        "chat",
                        "21vftV7EKUOu5kCAP11WyygDUFG2",
                        "chatUsers",
                        userId,
                        "messages"
                    ),
                    orderBy("timestamp")
                ),
                (snapshot) => {
                    setAllMessages(
                        snapshot.docs.map((doc) => ({
                            id: doc.id,
                            messages: doc.data(),
                        }))
                    );
                }
            );
            return unsub;
        }




    }, []);



    const sendMessage = async () => {
        // console.log("about to send")
        if (chatMessage.trim() === "") return

        try {
            if (user.uid === "21vftV7EKUOu5kCAP11WyygDUFG2") {


                await addDoc(
                    collection(
                        db,
                        "chat",
                        "21vftV7EKUOu5kCAP11WyygDUFG2",
                        "chatUsers",
                        route?.params?.id,

                        "messages"
                    ),
                    {
                        username: "admin",
                        messageUserId: user.uid,
                        message: chatMessage?.trim(),
                        timestamp: new Date(),
                    }
                );
                console.log("admin send")
            }


            if (user.uid !== "21vftV7EKUOu5kCAP11WyygDUFG2") {

                await addDoc(
                    collection(
                        db,
                        "chat",
                        "21vftV7EKUOu5kCAP11WyygDUFG2",
                        "chatUsers",
                        user.uid,
                        "messages"
                    ),
                    {
                        username: user.displayName,
                        messageUserId: user.uid,
                        message: chatMessage?.trim(),
                        timestamp: new Date(),
                    }
                );

            }


        } catch (error) {
            console.log(error);
        }
        setChatMessage("");
    };



    console.log(user.uid)


    const Item = ({ item }) => {
        let time = item?.messages?.timestamp?.toDate()
        console.log(item)

        return (
            <View style={[styles.container, item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? { backgroundColor: "#3376bc", marginLeft: "auto" } : { backgroundColor: "lightgrey", marginRight: "auto" }]}>
                <Text style={{ color: !item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? "black" : "white", fontSize: 18 }}>{item?.messages?.message}</Text>
                <Text style={{ color: item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? "lightgray" : "black", fontSize: 15, fontStyle: "italic" }}>{moment(time).fromNow()}</Text>
            </View>
        )
    }


    return (
        <KeyboardAvoidingView style={styles.root}>

            <FlatList data={allMessages} renderItem={({ item }) => <Item item={item} />} />
            <View style={styles.inputContainer}>
                <View style={styles.inputCon}>
                    <TextInput placeholder='send message ....' value={chatMessage} onChangeText={setChatMessage} style={styles.input} />
                </View>
                <View style={{ paddingHorizontal: 5 }}>
                    <Ionicons onPress={sendMessage} name="send" size={24} color="black" />
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Chat

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "white",
    },
    container: {
        padding: 10,
        backgroundColor: "white",
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        maxWidth: "75%"
    },
    input: {
        width: "100%",
        // backgroundColor: "red", 
        padding: 5
    },
    inputContainer: {
        backgroundColor: "#f2f2f2",
        borderRadius: 20,
        margin: 10,
        padding: 5,
        flexDirection: "row",
        alignItems: "center"
    }, inputCon: {
        flexGrow: 1,
        borderRightWidth: 1,
        borderColor: "lightgrey"
    }
})