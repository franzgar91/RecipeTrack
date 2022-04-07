import React from "react";
import { Platform, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import Dashboard2 from "../components/dashboard2";
import Dashboard from "../components/dashboard";
import AddRecipe from "../components/addrecipe";
import { View } from "react-native-web";
const Stack = createStackNavigator();
function AppNavigator(props) {
  console.log(props);
  return (
    //<SafeAreaView>

    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard2"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ title: "", headerLeft: null }}
        />
        <Stack.Screen
          name="Dashboard2"
          component={Dashboard2}
          options={{ title: "", headerLeft: null }}
        />
        <Stack.Screen
          name="Addrecipe"
          component={AddRecipe}
          options={{ title: "", headerLeft: null }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// function AppNavigator(props) {
//   return (
//     // <Dashboard>

//     <NavigationContainer>
//       <Tab.Navigator
//         initialRouteName="Home"
//         screenOptions={{
//           activeTintColor: "#42f44b",
//         }}
//       >
//         <Tab.Screen
//           name="Home"
//           component={Dashboard}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <Foundation name="home" color={color} size={50} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Home2"
//           component={Dashboard}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <Foundation name="home" color={color} size={50} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Home3"
//           component={Dashboard}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <Foundation name="home" color={color} size={50} />
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="Home4"
//           component={Dashboard}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <Foundation name="home" color={color} size={50} />
//             ),
//           }}
//         />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

export default AppNavigator;
