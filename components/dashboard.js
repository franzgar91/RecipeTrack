import React, { useState, useEffect } from "react";
import { Foundation } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Pressable,
  Image,
  StyleSheet,
  ImageBackground,
  Text,
  View,
  Alert,
  Button,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
} from "react-native";
import { useFonts } from "expo-font";
import { db, firestore, auth } from "../FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  documentId,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import AddRecipe from "./addrecipe";
import { LogBox } from "react-native";
import * as MailComposer from "expo-mail-composer";

LogBox.ignoreLogs(["Setting a timer"]);

const Dashboard = (props) => {
  LogBox.ignoreLogs(["Setting a timer"]);
  console.log(props.route.params.userID);
  let [fontsLoaded] = useFonts({
    myfont: require("../assets/fonts/DancingScript-Bold.ttf"),
    ibmfont: require("../assets/fonts/IBMPlexSans-Regular.ttf"),
  });
  const [myDataArray, setDataArray] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [picUri, setPicUri] = useState("");
  const [recipeId, setRecipeId] = useState("");
  const [dataChanged, setDataChanged] = useState(false);

  React.useEffect(() => {
    getUserRecipes();
  }, [isModal, dataChanged]);

  let myData = [];

  const toggleData = () => {
    if (dataChanged) {
      setDataChanged(false);
    } else {
      setDataChanged(true);
    }
  };
  const getUserRecipes = async () => {
    const q = query(
      collection(firestore, "Recipes"),
      where("userid", "==", props.route.params.userID),
      orderBy("name")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(myData);
      //console.log(doc.data().name);
      myData.push({
        name: doc.data().name,
        instructions: doc.data().Instructions,
        ingredients: doc.data().ingredientes,
        id: doc.id,
        picture: doc.data().picture,
      });
      setDataArray(myData);
    });
  };
  const deleteRecipe = async () => {
    // const q = query(
    //   collection(firestore, "Recipes"),
    //   where(firestore.FieldPath.documentId(), "==", recipeId)
    // );
    const q = query(
      collection(firestore, "Recipes"),
      where("userid", "==", props.route.params.userID)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      if (doc.id === recipeId) {
        console.log("attempting to delete " + doc.id);
        firestore
          .collection("Recipes")
          .doc(doc.id)
          .delete()
          .then(() => console.log("deleted"))
          .catch((error) => {
            console.log(error);
          });

        // await firestore.deleteDoc(doc);
      } else {
        console.log("NOT deleting " + doc.id);
      }
    });

    setIsModal(false);
  };
  if (!fontsLoaded) {
    return null;
  }

  const onClickRecipe = (data) => {
    //getting the recipe data from our array that is holding the information
    //of all recipes the user has saved
    const a = myDataArray.find((element) => {
      return element.id === data;
    });
    console.log(a);
    setRecipeName(a.name);
    setIngredients(a.ingredients);
    setInstructions(a.instructions);
    setRecipeId(a.id);
    setPicUri(a.picture);
    setIsModal(true);
  };
  const image = require("../assets/recipebackground.jpg");
  const image2 = require("../assets/addrecipepaper.jpg");

  const sendJokesWithEmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      var options = {
        recipients: ["test@test.com"],
        subject: `${recipeName} Recipe`,
        body:
          `${recipeName}` +
          `\n\nIngredients:` +
          `\n${ingredients}` +
          `\n\nInstructions` +
          `${instructions}`,
      };
      MailComposer.composeAsync(options).then((result) => {
        console.log(result.status);
      });
    } else {
      Alert.alert("Email is not available");
    }
  };

  const deleteConfirm = () => {
    Alert.alert("Deletion ", `Do you want to delete ${recipeName} recipe?`, [
      { text: "YES", onPress: deleteRecipe },
      {
        text: "NO",
      },
    ]);
  };
  return (
    //<View style={styles.container}>
    <ImageBackground source={image} style={styles.image}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Your Recipes</Text>
      </View>

      <View style={styles.jokeContainer}>
        <FlatList
          data={myDataArray}
          renderItem={(itemData) => (
            <TouchableOpacity onPress={() => onClickRecipe(itemData.item.id)}>
              <Text style={styles.recipe}>{itemData.item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.centeredView}>
        <Modal animationType="fade" visible={isModal} transparent={true}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={{ fontFamily: "myfont", fontSize: 40 }}>
                {recipeName}
              </Text>
              <Text
                style={{ fontFamily: "ibmfont", fontSize: 20, marginTop: 10 }}
              >
                Ingredients:
              </Text>
              <Text
                style={{ marginTop: 4, fontFamily: "myfont", fontSize: 22 }}
              >
                {ingredients}
              </Text>
              <Text
                style={{ fontFamily: "ibmfont", fontSize: 20, marginTop: 10 }}
              >
                Instructions:
              </Text>
              <Text
                style={{ fontFamily: "myfont", fontSize: 22, marginTop: 4 }}
              >
                {instructions}
              </Text>
              {picUri !== "" ? (
                <Image
                  source={{ uri: picUri }}
                  style={{
                    width: 220,
                    height: 200,
                    alignItems: "center",
                  }}
                />
              ) : null}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 35,
                }}
              >
                <TouchableOpacity
                  style={{
                    // backgroundColor: "#5c6691",
                    // paddingHorizontal: 12,
                    // paddingVertical: 4,
                    marginRight: 20,
                    padding: 2,
                    backgroundColor: "#46d645",
                  }}
                  onPress={() => setIsModal(false)}
                >
                  <MaterialIcons name="close" size={50} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginRight: 20,
                    padding: 2,
                    backgroundColor: "#46d645",
                  }}
                  onPress={sendJokesWithEmail}
                >
                  <MaterialIcons name="email" size={50} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={deleteConfirm}
                  style={{ backgroundColor: "#b0192a", padding: 2 }}
                >
                  <MaterialCommunityIcons
                    name="trash-can"
                    size={50}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.buttonContainer}>
        <View style={{ flexDirection: "column" }}>
          <TouchableOpacity onPress={() => console.log("we here")}>
            <Foundation name="home" size={50} color="white" />
          </TouchableOpacity>
          <Text style={{ color: "white", marginTop: -6 }}>Home</Text>
        </View>
        <View style={{ flexDirection: "column" }}>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("Addrecipe", {
                userID: props.route.params.userID,
                getData: toggleData,
              })
            }
          >
            <MaterialIcons name="add-box" size={50} color="white" />
            <Text
              style={{ color: "white", marginTop: -6, textAlign: "center" }}
            >
              Add
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "column" }}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Dashboard2")}
          >
            <Entypo name="log-out" size={42} color="white" />
          </TouchableOpacity>
          <Text style={{ color: "white", marginTop: -3, textAlign: "center" }}>
            Sign Out
          </Text>
        </View>
      </View>
    </ImageBackground>
    //</View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },
  modalView: {
    height: "100%",
    width: "95%",
    margin: 5,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  recipe: { fontSize: 25, fontFamily: "ibmfont", color: "white" },
  titleContainer: {
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  title: {
    paddingBottom: 5,
    paddingTop: 40,
    fontSize: 35,
    fontFamily: "myfont",
    justifyContent: "center",
    color: "white",
  },
  jokeContainer: {
    // backgroundColor: "#92a8d1",
    width: "80%",
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(192,192,192,0.8)",
    borderRadius: 10,
    elevation: 1,
  },
  joke: {
    // padding:100,
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "center",
    color: "#034f84",
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
