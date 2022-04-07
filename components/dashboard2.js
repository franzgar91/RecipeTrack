import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
  ImageBackground,
} from "react-native";
import CheckBox from "expo-checkbox";
import { db, firestore, auth } from "../FirebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
const Dashboard2 = (props) => {
  let [fontsLoaded] = useFonts({
    myfont: require("../assets/fonts/DancingScript-Bold.ttf"),
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginReady, setLoginReady] = useState(false);
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [maskedPassword, setMaskedPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [logScreen, setLogScreen] = useState(true);
  const [userID, setUserID] = useState("test");

  React.useEffect(() => {
    checkforLog();
  });
  const image = require("../assets/loginpage.jpg");
  const checkforLog = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setEmailLogin("");
      setPasswordLogin("");
      props.navigation.navigate("Dashboard", { userID: userID });
    }
  };
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
            setEmailLogin("");
            setPasswordLogin("");
            toggleLogScreen();
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
        setUserID(_firebaseUser.user.uid);
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
  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
        {!isLoggedIn && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              padding: 20,
              borderRadius: 20,
              width: "96.5%",
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "myfont",
                  fontSize: 35,
                }}
              >
                Welcome to RecipeTrack{" "}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="food-fork-drink"
              size={35}
              color="black"
              style={{ marginBottom: 35 }}
            />
            <View width={370}>
              <Text
                style={{
                  marginBottom: 10,
                  fontWeight: "bold",
                  marginLeft: "3%",
                }}
              >
                {logScreen ? "Log in" : "Register"}
              </Text>
              <TextInput
                style={[styles.input, { marginLeft: "3%" }]}
                placeholder="Email"
                onChangeText={emailLoginHandler}
                value={emailLogin}
              />
              <TextInput
                style={[styles.input, { marginTop: 25, marginLeft: "3%" }]}
                placeholder="Password"
                onChangeText={passwordLoginHandler}
                value={passwordLogin}
                secureTextEntry={!isPasswordVisible ? true : false}
              />
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 25,
                  marginLeft: "3%",
                }}
              >
                <CheckBox
                  value={isPasswordVisible}
                  onValueChange={setIsPasswordVisible}
                  style={{ alignItems: "center" }}
                />
                <Text> {"  "}Show password?</Text>
              </View>
            </View>
            <Pressable
              style={{
                marginTop: 35,
                paddingHorizontal: 30,
                paddingVertical: 12,
                backgroundColor: "#4285F4",
                borderRadius: 4,
                elevation: 3,
                width: "50%",
              }}
              onPress={logScreen ? loginWithFireBase : registerWithFirebase}
            >
              <Text
                style={{ color: "white", textAlign: "center", fontSize: 20 }}
              >
                {logScreen ? "Log In" : "Register"}
              </Text>
            </Pressable>
            <View style={{ flexDirection: "row", marginTop: 55 }}>
              <Text
                onPress={resetPassword}
                style={logScreen ? { marginRight: 90 } : null}
              >
                {logScreen ? "Forgot password?" : null}
              </Text>
              <Text onPress={toggleLogScreen}>
                {logScreen
                  ? "Sign up for RecipeTrack?"
                  : "Have an account? Log in."}
              </Text>
            </View>
          </View>
        )}
        <StatusBar style="auto" />
      </ImageBackground>
    </View>
  );
};
export default Dashboard2;
//props.navigation.navigate("Dashboard"))
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
    top: 0,
  },
  input: {
    borderColor: "#ccc6c6",
    borderWidth: 1,
    fontSize: 20,
    width: "94%",
   
  },
});
