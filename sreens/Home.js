
import {SafeAreaView, StyleSheet} from "react-native"
import { Coinsection, Header } from "../components";


const Home = ({navigation}) => {
 
 
    return (
        <SafeAreaView style={styles.homeContainer}>
            <Header navigation={navigation} />
            <Coinsection />
        </SafeAreaView>
    )

}

export default Home


const styles = StyleSheet.create({
    homeContainer: {
      flex: 1,
    },
  });
  