import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import CheckBox from "expo-checkbox";
import { db, firestore, auth } from "./FirebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import Dashboard from "./components/dashboard";
import AppNavigator from "./navigation/appnavigator";
export default function App() {
  let [fontsLoaded] = useFonts({
    myfont: require("./assets/fonts/DancingScript-Bold.ttf"),
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loginReady, setLoginReady] = useState(false);
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [maskedPassword, setMaskedPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [logScreen, setLogScreen] = useState(true);

  const toggleLogScreen = () => {
    if (logScreen) {
      setLogScreen(false);
    } else {
      setLogScreen(true);
    }
  };
  const registerWithFirebase = () => {
    if (emailLogin.length < 4) {
      Alert.alert("Please enter a valid email address.");
      return;
    }
    if (passwordLogin.length < 4) {
      Alert.alert("Please enter a valid password.");
      return;
    }

    auth
      .createUserWithEmailAndPassword(emailLogin, passwordLogin)
      .then(function (_firebaseUser) {
        console.log(_firebaseUser.user.uid);
        firestore
          .collection("Users")
          .doc(_firebaseUser.user.uid)
          .set(
            {
              email: _firebaseUser.user.email,
            },
            {
              merge: true,
            }
          )
          .then(function () {
            Alert.alert("User Registered");
          });
      })
      .catch(function (error) {
        console.log("The error is:  " + error);
        Alert.alert("The current email is already in use.");
      });
  };

  const loginWithFireBase = () => {
    auth
      .signInWithEmailAndPassword(emailLogin, passwordLogin)
      .then(function (_firebaseUser) {
        Alert.alert("User logged in");
        setIsLoggedIn(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const resetPassword = () => {
    if (emailLogin.length < 4) {
      Alert.alert("Please enter a valid email address in the Email Field");
      return;
    }
    auth
      .sendPasswordResetEmail(emailLogin)
      .then(() => {
        Alert.alert(`Email sent to ${emailLogin}`);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const emailLoginHandler = (data) => {
    setEmailLogin(data);
  };
  const passwordLoginHandler = (data) => {
   
    setPasswordLogin(data);
  };
  if (!fontsLoaded) {
    return null;
  }
  return <AppNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderColor: "#ccc6c6",
    borderWidth: 1,
    fontSize: 20,
  },
});
