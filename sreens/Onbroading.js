import React from 'react'
import { Text, View, StyleSheet , TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'



const Onbroading = ({ navigation }) => {
 


  return (
    <SafeAreaView style={styles.onbrodingContainer}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end',
            flexDirection: 'row',
          }}
        >
          <Text style={[styles.onbroadingtitle, { paddingRight: 15 }]}>
            coinbase
          </Text>
          <Text
            style={[
              styles.onbroadingtitle,
              {
                borderLeftWidth: 4,
                borderLeftColor: '#ccc',
                color: '#000',
                paddingLeft: 15,
              },
            ]}
          >
            Pro
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('Login')}>
            <View style={styles.onbroadingButton}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'Nunito-Black',
                  marginRight: 80,
                }}
              >
                Get Started
              </Text>
              <AntDesign name="rightcircleo" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Onbroading

const styles = StyleSheet.create({
  onbrodingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  onbroadingtitle: {
    color: '#3376bc',
    fontFamily: 'Nunito-Black',
    fontWeight: 'bold',
    fontSize: 40,
    // transform: [{ rotate: '-5deg' }],
  },

  onbroadingButton: {
    backgroundColor: '#3376bc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
})
