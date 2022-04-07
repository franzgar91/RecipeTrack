import React, { useState, useEffect } from "react";
import { Foundation } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { db, firestore, auth } from "../FirebaseConfig";
import * as FileSystem from "expo-file-system";
import { LogBox } from "react-native";
import {
  StyleSheet,
  Image,
  Text,
  View,
  Alert,
  Button,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const AddRecipe = (props) => {
  LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
  ]);
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [Instructions, setInstructions] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [URItoSave, setURItoSave] = useState("");
  const [isPic, setIsPic] = useState(false);

  const verifyPermissions = async () => {
    const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
    const libraryResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      cameraResult.status !== "granted" &&
      libraryResult.status !== "granted"
    ) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app.",
        [{ text: "Okay" }]
      );
      return false;
    }
    return true;
  };
  const recipeNameHandler = (data) => {
    setRecipeName(data);
  };
  let [fontsLoaded] = useFonts({
    myfont: require("../assets/fonts/DancingScript-Bold.ttf"),
  });
  const ingredientsHandler = (data) => {
    setIngredients(data);
  };
  const instructionsHandler = (data) => {
    setInstructions(data);
  };

  let counter = 1;

  const onCancel = () => {
    props.navigation.navigate("Dashboard", {
      userID: props.route.params.userID,
    });
  };

  const onSave = async () => {
    try {
      let newUri = "";
      if (selectedImage !== "") {
        const fileName = selectedImage.split("/").pop();
        newUri = FileSystem.documentDirectory + fileName;
        setURItoSave(newUri);
        await FileSystem.moveAsync({
          from: selectedImage,
          to: newUri,
        });
      }

      firestore
        .collection("Recipes")
        .doc()
        .set({
          ingredientes: ingredients,
          Instructions: Instructions,
          name: recipeName,
          userid: props.route.params.userID,
          picture: newUri,
        })
        .then(function () {
          Alert.alert("Recipe Saved!");
          props.route.params.getData();
          props.navigation.navigate("Dashboard", {
            userID: props.route.params.userID,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  if (!fontsLoaded) {
    return null;
  }
  const image = require("../assets/addrecipepaper.jpg");

  const changeRecipePicHandler = async () => {
    console.log("Changing Recipe pic");

    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      console.log("There are no permissions to use camera");
      return false;
    }

    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      // aspect: [16, 9],
      quality: 1,
    });

    if (!image.cancelled) {
      setSelectedImage(image.uri);
      setIsPic(true);
    }
  };

  const movePhoto = async () => {
    try {
      const fileName = selectedImage.split("/").pop();
      const newUri = FileSystem.documentDirectory + fileName;
      setURItoSave(newUri);
      await FileSystem.moveAsync({
        from: selectedImage,
        to: newUri,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Add New Recipe</Text>
        </View>

        <View style={styles.jokeContainer}>
          <Text style={{ fontWeight: "bold", marginBottom: 8, fontSize: 18 }}>
            Name of Recipe:
          </Text>
          <TextInput
            style={{
              marginBottom: 8,
              textAlignVertical: "top",
              borderColor: "gray",
              borderWidth: 1,
              fontSize: 16,
            }}
            placeholder="Recipe's Name"
            onChangeText={recipeNameHandler}
            value={recipeName}
            multiline={true}
          />
          <Text style={{ fontWeight: "bold", marginBottom: 8, fontSize: 18 }}>
            Ingredients:
          </Text>
          <TextInput
            style={{
              marginBottom: 8,
              textAlignVertical: "top",
              borderColor: "gray",
              borderWidth: 1,
              fontSize: 16,
            }}
            placeholder={`Ingredient ${counter}`}
            onChangeText={ingredientsHandler}
            value={ingredients}
            multiline={true}
            numberOfLines={4}
          />
          <Text style={{ fontWeight: "bold", marginBottom: 8, fontSize: 18 }}>
            Instructions:
          </Text>
          <TextInput
            style={{
              marginBottom: 8,
              textAlignVertical: "top",
              borderColor: "gray",
              borderWidth: 1,
              fontSize: 16,
            }}
            placeholder="Instructions..."
            onChangeText={instructionsHandler}
            value={Instructions}
            multiline={true}
            numberOfLines={10}
          />
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginRight: 70 }}>
              Picture:
            </Text>
            <TouchableOpacity onPress={changeRecipePicHandler}>
              {!isPic ? (
                <Image
                  source={require("../assets/default.png")}
                  style={{
                    width: 125,
                    height: 120,
                    alignItems: "center",
                  }}
                />
              ) : (
                <Image
                  source={{ uri: selectedImage }}
                  style={{
                    width: 140,
                    height: 125,
                    alignItems: "center",
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#54914c",
              padding: 10,
              marginRight: 20,
              width: "40%",
            }}
            onPress={onSave}
          >
            <Text style={{ color: "white", textAlign: "center" }}>SAVE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: "#ad7134", padding: 10, width: "40%" }}
            onPress={onCancel}
          >
            <Text style={{ color: "white", textAlign: "center" }}>CANCEL</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <View style={{ flexDirection: "column" }}>
            <TouchableOpacity onPress={onCancel}>
              <Foundation name="home" size={50} color="white" />
            </TouchableOpacity>
            <Text style={{ color: "white", marginTop: -6 }}>Home</Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <TouchableOpacity onPress={() => console.log("we here already")}>
              <MaterialIcons name="add-box" size={50} color="white" />
            </TouchableOpacity>
            <Text
              style={{ color: "white", marginTop: -6, textAlign: "center" }}
            >
              Add
            </Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Dashboard2")}
            >
              <Entypo name="log-out" size={42} color="white" />
            </TouchableOpacity>
            <Text
              style={{ color: "white", marginTop: -3, textAlign: "center" }}
            >
              Sign Out
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default AddRecipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  image: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
    top: 0,
  },
  titleContainer: {
    paddingTop: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 17,
  },
  title: {
    paddingBottom: 5,
    paddingTop: 40,
    fontSize: 35,
    //fontWeight: "bold",
    justifyContent: "center",
    color: "black",
    fontFamily: "myfont",
  },
  jokeContainer: {
    //backgroundColor: "#92a8d1",
    width: "90%",
    //padding: 70,
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
  },
  joke: {
    // padding:100,
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    //color: "#034f84",
    alignContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    height: "9%",
    alignItems: "center",
    justifyContent: "space-evenly",
    //paddingBottom:50
    backgroundColor: "green",
    position: "absolute",
    bottom: 0,
  },
});
