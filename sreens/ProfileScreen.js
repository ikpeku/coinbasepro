import React, { useContext, useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import { updateProfile } from 'firebase/auth'
import { updateDoc, doc, getDoc, onSnapshot, Timestamp } from 'firebase/firestore'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth, db } from '../firebase/firebaseConfig'
import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import Toast from 'react-native-root-toast';


import * as ImagePicker from 'expo-image-picker';
// import { uuid } from 'uuidv4';

import { SignnedOut } from '../firebase/firebaseConfig'

import { AuthContext } from '../context/AuthContext'
import { uriToBlob } from '../components/uriToBlob'


const ProfileScreen = () => {

  const { user } = useContext(AuthContext)

  const [upload, setUploadError] = useState(false)

  // state edit input
  const [changeDetail, setChangeDetail] = useState(false)

  // textinput state
  const [Name, setFullName] = useState("")
  const [Email, setEmail] = useState("")
  const [DOB, setDOB] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  const [bankName, setbankName] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accountName, setAccountName] = useState("")
  const [swiftCode, setSwiftCode] = useState("")

  const [licenceUrl, setLicenceUrl] = useState("")
  const [passporteUrl, setPassporteUrl] = useState("")
  const [licenceBackUrl, setLicenceBackUrl] = useState("")




  const onSubmit = async () => {
    try {
      const userRef = doc(db, "users", auth.currentUser?.uid)
      if (auth.currentUser?.displayName !== Name) {
        await updateProfile(auth.currentUser, { displayName: Name })


        await updateDoc(userRef, { Name })

      }


      if (auth.currentUser.phoneNumber !== phoneNumber) {
        await updateDoc(userRef, { phoneNumber })

      }

      await updateDoc(userRef, { bankName, accountNumber, accountName, swiftCode })
      await updateDoc(userRef, { DOB: Timestamp.fromDate(new Date(DOB)) })


    } catch (error) {
      Toast.show("update fail try again", {
        duration: Toast.durations.SHORT
      })
    }

  }


  useEffect(() => {

    const refDoc = doc(db, "users", auth.currentUser.uid)

    const unsub = onSnapshot(refDoc, (snapshot) => {
      if (snapshot.exists() && changeDetail === false) {
        const { Name, Email, DOB, phoneNumber, bankName, accountNumber, accountName, swiftCode, passport, licence, licenceBack } = snapshot?.data()
        setFullName(Name)
        setEmail(Email)
        setDOB(DOB.toDate().toLocaleDateString())
        setPhoneNumber(phoneNumber)
        setbankName(bankName)
        setAccountNumber(accountNumber)
        setAccountName(accountName)
        setSwiftCode(swiftCode)
        setPassporteUrl(passport)
        setLicenceUrl(licence)
        setLicenceBackUrl(licenceBack)

      }
    })

    return () => unsub()
  }, [])


  // image picker
  const [passport, setPassport] = useState(null);
  const [licence, setLicence] = useState(null);
  const [licenceBack, setLicenceBack] = useState(null);



  const pickLicence = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);
    if (!result.canceled) {
      setLicence(result.assets[0].uri);
    }
  };


  const pickLicenceBack = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);
    if (!result.canceled) {
      setLicenceBack(result.assets[0].uri);
    }
  };





  const pickPassport = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      canceled: true
    });


    if (!result.canceled) {
      setPassport(result.assets[0].uri);
    }
  };





  // upload image to cloud 


  const handleImagesSubmit = async () => {


    setUploadError(false)
    const userRef = doc(db, "users", auth.currentUser?.uid)
    const getPassport = passport
    const getLicence = licence
    const getLicenceBack = licenceBack

    try {

      if (getPassport) {
        // passport
        // const response = await fetch(getPassport);
        // const blobFile = await response.blob();
        const blobFile = await uriToBlob(getPassport)

        const passportfile = `${auth.currentUser?.displayName}-${passport}`
        const reference = ref(getStorage(), passportfile)
        await uploadBytesResumable(reference, blobFile)
        const downloadURL = await getDownloadURL(reference);
        await updateDoc(userRef, { passport: downloadURL })
      }

      if (getLicence) {
        // licence
        // const responseL = await fetch(getLicence);
        // const blobFileL = await responseL.blob();
        const blobFileL = await uriToBlob(getLicence);

        const passportfileL = `${auth.currentUser?.displayName}-${licence}`
        const referenceL = ref(getStorage(), passportfileL)
        await uploadBytesResumable(referenceL, blobFileL)
        const downloadURLL = await getDownloadURL(referenceL);
        await updateDoc(userRef, { licence: downloadURLL })
      }


      if (getLicenceBack) {
        // licenceBack
        // const responseLB = await fetch(getLicenceBack);
        // const blobFileLB = await responseLB.blob();
        const blobFileLB = await uriToBlob(getLicenceBack);

        const passportfileLB = `${auth.currentUser?.displayName}-${licenceBack}`
        const referenceLB = ref(getStorage(), passportfileLB)
        await uploadBytesResumable(referenceLB, blobFileLB)
        const downloadURLLB = await getDownloadURL(referenceLB);
        await updateDoc(userRef, { licenceBack: downloadURLLB })
      }


      Toast.show("successful", {
        textColor: "green",
        duration: Toast.durations.SHORT,
        position: "top"
      })

    } catch (e) {
      Toast.show("fail to upload doc", {
        textColor: "red",
        duration: Toast.durations.SHORT
      })
    }


  }


  return (
    <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: "#f1f2f7" }}>
      <ScrollView>
        <View style={{ backgroundColor: "#f1f2f7" }}>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 30, marginTop: 25 }}>
            <Text style={{ fontWeight: "bold", fontSize: 24, textAlign: "center", fontFamily: "Nunito-Bold" }}>My Profile</Text>
            <TouchableOpacity onPress={() => SignnedOut()}>
              <Text style={{ fontWeight: "bold", fontSize: 18, textAlign: "center", fontFamily: "Nunito-Bold", backgroundColor: "red", color: "#fff", padding: 5, borderRadius: 10 }}>Log-out</Text>
            </TouchableOpacity>
          </View>

          {/* main provide start */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10, marginTop: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16, textAlign: "center", fontFamily: "Nunito-Bold" }}>Personal Details</Text>

            <TouchableOpacity onPress={() => {
              changeDetail && onSubmit()
              setChangeDetail((prev) => !prev)
            }}>
              <Text style={{ fontSize: 18, textAlign: "center", fontFamily: "Nunito-Medium", color: "green", padding: 5, borderRadius: 20 }}>{changeDetail ? "done" : "edit"}</Text>
            </TouchableOpacity>
          </View>


          <View style={{ backgroundColor: "#f1f2f7" }}>

            <View style={{ marginVertical: 12 }}>
              <View style={{ flexDirection: "row", }}>
                <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "Nunito-Medium" }}>Name: </Text>
                <TextInput multiline={true} style={!changeDetail ? { marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "#fff", borderRadius: 10, color: "#000", paddingHorizontal: 15, paddingVertical: 5 } : { marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "gray", borderRadius: 10, color: "#fff", paddingHorizontal: 15, paddingVertical: 5 }} editable={changeDetail} value={Name} onChangeText={(text) => setFullName(text)} />
              </View>
              <Text style={{ textAlign: "center", fontFamily: "Nunito-Regular", fontStyle: "italic" }}>Valid name is require for your KYC</Text>

            </View>

            <View style={{ flexDirection: "row", marginVertical: 12 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "Nunito-Medium" }}>Email: </Text>
              <TextInput multiline={true} style={{ marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "#fff", borderRadius: 10, color: "#000", paddingHorizontal: 15, paddingVertical: 5 }} editable={false} value={Email} onChangeText={(text) => setEmail(text)} />
            </View>
            {/* <Text style={{textAlign: "center", fontFamily: "Nunito-Regular", fontStyle: "italic"}}>{!auth.currentUser?.emailVerified ? "unverified email" : "email is verified"}</Text> */}


            <View style={{ flexDirection: "row", marginVertical: 12 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "Nunito-Medium" }}>D.O.B. : </Text>
              <TextInput multiline={true} style={!changeDetail ? { marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "#fff", borderRadius: 10, color: "#000", paddingHorizontal: 15, paddingVertical: 5 } : { marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "gray", borderRadius: 10, color: "#fff", paddingHorizontal: 15, paddingVertical: 5 }} editable={changeDetail} value={DOB} onChangeText={(text) => setDOB(text)} />
            </View>

            <View style={{ flexDirection: "row", marginVertical: 12 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "Nunito-Medium" }}>Phone Number: </Text>
              <TextInput multiline={true} placeholderTextColor={changeDetail ? "#fff" : "#000"} inputMode="tel" keyboardType="phone-pad" placeholder="enter phone number" style={!changeDetail ? { marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "#fff", borderRadius: 10, color: "#000", paddingHorizontal: 15, paddingVertical: 5 } : { marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "gray", borderRadius: 10, color: "#fff", paddingHorizontal: 15, paddingVertical: 5 }} editable={changeDetail} value={phoneNumber} onChangeText={(text) => setPhoneNumber(text)} />
            </View>

          </View>

          {/* Withdrawal settings */}

          <View style={{ flex: 1, marginTop: 20 }}>
            <View style={{ backgroundColor: "#1a2036", padding: 10, height: 300 }}>
              <Text style={{ fontWeight: "bold", fontSize: 22, fontFamily: "Nunito-Medium", color: "#fff" }}>Withdrawal Settings</Text>
            </View>

            <View style={{ borderColor: "gray", borderWidth: 2, padding: 10, flex: 1, marginTop: -250, backgroundColor: "#fff", marginHorizontal: 10, borderRadius: 10 }}>

              <View style={{ borderColor: "gray", borderWidth: 2, padding: 10, flex: 1, backgroundColor: "#fff", marginHorizontal: 10, borderRadius: 10 }}>
                {/* Input bank details */}
                <View style={{}}>
                  <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "Nunito-Medium" }}>Bank Name: </Text>
                  <TextInput multiline={true} placeholderTextColor="#fff" placeholder="Enter bank name" style={!changeDetail ? { marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "gray", borderRadius: 10, color: "#fff", paddingHorizontal: 15, paddingVertical: 5 } : { marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "gray", borderRadius: 10, color: "#fff", paddingHorizontal: 15, paddingVertical: 5 }} editable={changeDetail} value={bankName} onChangeText={(text) => setbankName(text)} />
                </View>

                <View style={{}}>
                  <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "Nunito-Medium" }}>Account Name: </Text>
                  <TextInput multiline={true} placeholderTextColor="#fff" placeholder="Enter account name" style={!changeDetail ? { marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "gray", borderRadius: 10, color: "#fff", paddingHorizontal: 15, paddingVertical: 5 } : { marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "gray", borderRadius: 10, color: "#fff", paddingHorizontal: 15, paddingVertical: 5 }} editable={changeDetail} value={accountName} onChangeText={(text) => setAccountName(text)} />
                </View>

                <View style={{}}>
                  <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "Nunito-Medium" }}>Account Number: </Text>
                  <TextInput multiline={true} placeholderTextColor="#fff" placeholder="Enter account number" style={!changeDetail ? { marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "gray", borderRadius: 10, color: "#fff", paddingHorizontal: 15, paddingVertical: 5 } : { marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "gray", borderRadius: 10, color: "#fff", paddingHorizontal: 15, paddingVertical: 5 }} editable={changeDetail} value={accountNumber} onChangeText={(text) => setAccountNumber(text)} />
                </View>

                <View style={{}}>
                  <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "Nunito-Medium" }}>Swift Code: </Text>
                  <TextInput multiline={true} placeholderTextColor="#fff" placeholder="Enter swift code" style={!changeDetail ? { marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "gray", borderRadius: 10, color: "#fff", paddingHorizontal: 15, paddingVertical: 5 } : { marginLeft: 10, fontSize: 18, fontFamily: "Nunito-Medium", flex: 1, backgroundColor: "gray", borderRadius: 10, color: "#fff", paddingHorizontal: 15, paddingVertical: 5 }} editable={changeDetail} value={swiftCode} onChangeText={(text) => setSwiftCode(text)} />
                </View>

              </View>
            </View>
          </View>

          {/* Account Verification start */}

          <View style={{ flex: 1, marginTop: 50 }}>
            <View style={{ backgroundColor: "#1a2036", padding: 10, height: 300 }}>
              <Text style={{ fontWeight: "bold", fontSize: 22, fontFamily: "Nunito-Medium", color: "#fff" }}>Account Verification</Text>
            </View>

            <View style={{ borderColor: "gray", borderWidth: 2, padding: 10, flex: 1, marginTop: -250, backgroundColor: "#fff", marginHorizontal: 10, borderRadius: 10 }}>

              <View style={{ borderColor: "gray", borderWidth: 2, padding: 10, flex: 1, backgroundColor: "#fff", marginHorizontal: 10, borderRadius: 10 }}>
                <Text style={{ fontWeight: "bold", fontSize: 20, fontFamily: "Nunito-Medium", fontStyle: "italic" }}>KYC verification - Upload documents below to get verified.</Text>

                <View style={{ marginTop: 10, paddingVertical: 10 }}>
                  <Text style={{ fontSize: 20, fontFamily: "Nunito-Medium", color: "gray" }}>Valid identity card. (e.g. Drivers licence, international passport or ny government approved document). </Text>
                </View>

                {/* licence front */}
                <View style={{ marginTop: 10, paddingTop: 10, borderWidth: 1, marginTop: 4, borderBottomWidth: 0, borderColor: "gray" }}>
                  <Text style={{ fontSize: 20, fontFamily: "Nunito-Medium", color: "gray", textAlign: "center", }}>Licence cover front</Text>
                </View>

                <TouchableOpacity onPress={pickLicence} style={{ borderColor: "gray", borderWidth: 1, borderTopWidth: 0, shadowColor: "gray", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 10 }}>
                  <Text style={{ paddingVertical: 6, paddingHorizontal: 15, borderRadius: 10, backgroundColor: "#e9e9e9", color: "#acdbf9", fontSize: 15 }}>{licenceUrl ? "change file" : "Choose File"}</Text>
                  <Text style={{ marginLeft: 10 }}>{licenceUrl ? "file selected" : "no file selected"}</Text>
                </TouchableOpacity>
                {licenceUrl ? <Image source={{ uri: licenceUrl }} style={{ height: 200, margin: 5 }} /> : <Image source={{ uri: licence }} style={{ height: 200, margin: 5 }} />}


                {/* licence back */}
                <View style={{ marginTop: 10, paddingTop: 10, borderWidth: 1, borderBottomWidth: 0, marginTop: 4, borderColor: "gray" }}>
                  <Text style={{ fontSize: 20, fontFamily: "Nunito-Medium", color: "gray", textAlign: "center", }}>Licence back cover</Text>
                </View>

                <TouchableOpacity onPress={pickLicenceBack} style={{ borderColor: "gray", borderWidth: 1, borderTopWidth: 0, shadowColor: "gray", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 10 }}>
                  <Text style={{ paddingVertical: 6, paddingHorizontal: 15, borderRadius: 10, backgroundColor: "#e9e9e9", color: "#acdbf9", fontSize: 15 }}>{licenceBackUrl ? "change file" : "Choose File"}</Text>
                  <Text style={{ marginLeft: 10 }}>{licenceBackUrl ? "file selected" : "no file selected"}</Text>
                </TouchableOpacity>

                {licenceBackUrl ? <Image source={{ uri: licenceBackUrl }} style={{ height: 200, margin: 5 }} /> : <Image source={{ uri: licenceBack }} style={{ height: 200, margin: 5 }} />}


                {/* pick passport */}

                <View style={{ marginTop: 10, paddingTop: 10, borderWidth: 1, borderBottomWidth: 0, marginTop: 4, borderColor: "gray" }}>
                  <Text style={{ fontSize: 20, fontFamily: "Nunito-Medium", color: "gray", textAlign: "center", }}>Passport photograph</Text>
                </View>

                <TouchableOpacity onPress={pickPassport} style={{ borderColor: "gray", borderWidth: 1, borderTopWidth: 0, shadowColor: "gray", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 10 }}>
                  <Text style={{ paddingVertical: 6, paddingHorizontal: 15, borderRadius: 10, backgroundColor: "#e9e9e9", color: "#acdbf9", fontSize: 15 }}>{passporteUrl ? "change file" : "Choose File"}</Text>
                  <Text style={{ marginLeft: 10 }}>{passporteUrl ? "file selected" : "no file selected"}</Text>
                </TouchableOpacity>


                {passporteUrl ? <Image source={{ uri: passporteUrl }} style={{ height: 200, margin: 5 }} /> : <Image source={{ uri: passport }} style={{ height: 200, margin: 5 }} />}



                {upload && <Text style={{ color: "red" }}>licence and passport require </Text>}

                <TouchableOpacity onPress={!licence && !passport ? () => setUploadError(true) : handleImagesSubmit} style={{ backgroundColor: "#1a2036", padding: 15, marginVertical: 20 }}>
                  <Text style={{ fontSize: 20, fontFamily: "Nunito-Medium", color: "#fff", textAlign: "center" }}>Submit documents</Text>
                </TouchableOpacity>

              </View>
            </View>
          </View>


        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileScreen
