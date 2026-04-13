import { View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { YesevaOne_400Regular } from '@expo-google-fonts/yeseva-one';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  const [fontsLoaded] = useFonts({
    YesevaOne_400Regular,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0D1117', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#F5C842" />
      </View>
    );
  }

  return <HomeScreen />;
}
