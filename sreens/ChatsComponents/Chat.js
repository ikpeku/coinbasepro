import React, { useState, useEffect, useMemo } from 'react'
import { StyleSheet, Text, View, FlatList, TextInput, KeyboardAvoidingView, Keyboard, Platform, Pressable, Image } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../../firebase/firebaseConfig'
import * as ImagePicker from 'expo-image-picker';
import { uuidv4 } from '@firebase/util';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";

import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import moment from 'moment';

import * as Clipboard from 'expo-clipboard';
import { uriToBlob } from '../../components/uriToBlob';

const Chat = ({ route }) => {

    const [openModal, setOpenModal] = useState(false)
    const [photoUrl, setPhotoUrl] = useState("")


    const [chatMessage, setChatMessage] = useState("");

    const [allMessages, setAllMessages] = useState([]);

    const [userData, setUserData] = useState(undefined)
    const [isSending, setIsSending] = useState(false)

    const user = auth.currentUser;

    const userId = route?.params?.id


    useEffect(() => {
        if (user.uid === "21vftV7EKUOu5kCAP11WyygDUFG2") {
            (async () => {
                const docref = doc(
                    db,
                    "chatUser",
                    "21vftV7EKUOu5kCAP11WyygDUFG2",
                    "chatUsers",
                    route?.params?.id,
                )

                const ref = await getDoc(docref)


                if (ref.exists()) {
                    await updateDoc(docref, {
                        isNewAdminMessage: 0,
                    })
                    setUserData(ref.data())
                }
            })()
        }

        if (user.uid !== "21vftV7EKUOu5kCAP11WyygDUFG2") {
            (async () => {
                const docref = doc(db,
                    "chatUser",
                    "21vftV7EKUOu5kCAP11WyygDUFG2",
                    "chatUsers",
                    user.uid)

                const ref = await getDoc(docref)
                if (ref.exists()) {
                    await updateDoc(docref, {
                        isNewUserMessage: 0,
                    })
                    setUserData(ref.data())

                }
            })()

        }
    }, [])
    // userData
    // userData
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
                    orderBy("timestamp", "desc")
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
            // unsub()
            // return unsub();
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
                    orderBy("timestamp", "desc")
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
            // unsub()
            // return unsub();
        }
    }, []);



    const sendMessage = async () => {

        if (chatMessage.trim() === "") return
        if (!chatMessage) return
        if (isSending) return
        setIsSending(true)



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
                        photo: null
                    }
                );

                const docref = doc(
                    db,
                    "chatUser",
                    "21vftV7EKUOu5kCAP11WyygDUFG2",
                    "chatUsers",
                    route?.params?.id,
                )

                const ref = await getDoc(docref)


                if (ref.exists()) {
                    await updateDoc(docref, {
                        isNewUserMessage: userData.isNewUserMessage + 1,
                        user: user.uid,
                    })

                } else {
                    await setDoc(docref, {
                        user: user.uid,
                        isNewUserMessage: 1
                    })
                }

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
                        photo: null
                    }
                );

                const docref = doc(db,
                    "chatUser",
                    "21vftV7EKUOu5kCAP11WyygDUFG2",
                    "chatUsers",
                    user.uid)

                const ref = await getDoc(docref)
                if (ref.exists()) {
                    await updateDoc(docref, {
                        isNewAdminMessage: userData.isNewAdminMessage + 1,
                        user: user.uid,

                    })

                } else {
                    await setDoc(docref, {
                        user: user.uid,
                        isNewAdminMessage: 1,

                    })
                }

            }

        } catch (error) {

        } finally {
            setChatMessage("");
            setIsSending(false)
            Keyboard.dismiss
        }
        setChatMessage("");
        setIsSending(false)
        Keyboard.dismiss
    };






    const pickPhoto = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        // console.log(result);
        if (!result.canceled) {
            const isPhoto = result.assets[0].uri
            const blobFile = await uriToBlob(isPhoto)

            const photo = `${auth.currentUser?.displayName}-${uuidv4()}`

            const reference = ref(getStorage(), photo)
            await uploadBytesResumable(reference, blobFile)
            const downloadURL = await getDownloadURL(reference);
            // console.log("link: ", downloadURL)

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
                            message: null,
                            timestamp: new Date(),
                            photo: downloadURL
                        }
                    );

                    const docref = doc(
                        db,
                        "chatUser",
                        "21vftV7EKUOu5kCAP11WyygDUFG2",
                        "chatUsers",
                        route?.params?.id,
                    )

                    const ref = await getDoc(docref)


                    if (ref.exists()) {
                        await updateDoc(docref, {
                            isNewUserMessage: userData.isNewUserMessage + 1,
                            user: user.uid,
                        })

                    } else {
                        await setDoc(docref, {
                            user: user.uid,
                            isNewUserMessage: 1
                        })
                    }

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
                            message: null,
                            timestamp: new Date(),
                            photo: downloadURL
                        }
                    );

                    const docref = doc(db,
                        "chatUser",
                        "21vftV7EKUOu5kCAP11WyygDUFG2",
                        "chatUsers",
                        user.uid)

                    const ref = await getDoc(docref)
                    if (ref.exists()) {
                        await updateDoc(docref, {
                            isNewAdminMessage: userData.isNewAdminMessage + 1,
                            user: user.uid,

                        })

                    } else {
                        await setDoc(docref, {
                            user: user.uid,
                            isNewAdminMessage: 1,

                        })
                    }

                }

            } catch (error) {

            }


        }
    };


    const Item = ({ item }) => {
        let time = item?.messages?.timestamp?.toDate()

        // isChat
        return (
            <>
                {item?.messages?.message && <Pressable
                    onPress={() => Clipboard.setStringAsync(item?.messages?.message)}
                    style={[styles.container, item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? { backgroundColor: "#3376bc", marginLeft: "auto" } : { backgroundColor: "lightgrey", marginRight: "auto" }]}>
                    {item?.messages?.message && <Text style={{ color: !item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? "black" : "white", fontSize: 18 }}>{item?.messages?.message}</Text>}
                    <Text style={{ color: item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? "lightgray" : "black", fontSize: 15, fontStyle: "italic" }}>{moment(time).fromNow()}</Text>
                </Pressable>}

                {item?.messages?.photo && <Pressable
                    onPress={() => {
                        setPhotoUrl(item?.messages?.photo)
                        setOpenModal(true)
                    }
                    }
                    style={[styles.container, item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? { backgroundColor: "#3376bc", marginLeft: "auto" } : { backgroundColor: "lightgrey", marginRight: "auto" }]}>
                    {item?.messages?.photo &&
                        <Image source={{ uri: item?.messages?.photo }}
                            style={{ height: 200, minWidth: "75%" }} resizeMode='cover' />
                    }
                    <Text style={{ color: item?.messages?.messageUserId === "21vftV7EKUOu5kCAP11WyygDUFG2" ? "lightgray" : "black", fontSize: 15, fontStyle: "italic" }}>{moment(time).fromNow()}</Text>
                </Pressable>}
            </>
        )
    }

    // const copyToClipboard = async (chat) => {
    //     Clipboard.setStringAsync(chat)
    // };


    console.log("chat")

    return (
        <KeyboardAvoidingView

            style={styles.root} keyboardVerticalOffset={60}>
            {!openModal && <>

                <FlatList
                    data={allMessages}
                    inverted
                    renderItem={({ item }) => <Item item={item} />} />
                <View style={styles.inputContainer}>
                    {/* {!isImage &&  */}
                    <View style={[styles.inputCon, { flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 5 }]}>
                        <TextInput multiline placeholder='send message ....' value={chatMessage} onChangeText={setChatMessage} style={styles.input} />
                        <Ionicons onPress={sendMessage} name="send" size={24} color="black" />
                    </View>

                    <View style={{ paddingHorizontal: 5 }}>
                        <MaterialIcons name="add-a-photo" size={24} color="black" onPress={pickPhoto} />
                    </View>
                </View>
            </>}

            {openModal &&

                <Pressable style={{ position: "relative" }}>
                    <Text onPress={() => setOpenModal(V => !V)}
                        style={{ position: "absolute", zIndex: 10, color: "#3376bc", fontSize: 30, right: 30, top: 20, fontWeight: "bold", textAlign: "right" }}>x</Text>
                    <Image source={{ uri: photoUrl }}
                        style={{ height: "100%", width: "100%" }} resizeMode='cover' />
                </Pressable>

            }
        </KeyboardAvoidingView>
    )
}

export default Chat

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "white",
        paddingVertical: 5
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
        width: "80%",
        // backgroundColor: "red", 
        padding: 5,
        flexGrow: 1
    },
    inputContainer: {
        backgroundColor: "#f2f2f2",
        borderRadius: 20,
        margin: 10,
        padding: 5,
        flexDirection: "row",
        alignItems: "flex-end",
        width: "100%",

    }, inputCon: {
        flexGrow: 1,
        borderRightWidth: 1,
        borderColor: "lightgrey",
        maxWidth: "85%"
    }
})