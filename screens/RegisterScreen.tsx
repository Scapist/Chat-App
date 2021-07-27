import React, { useLayoutEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, Image } from "react-native-elements";
import { auth } from "../firebase";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          user.updateProfile({
            displayName: username,
          });
        }
      })
      .catch((error) => alert(error.message));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerShown: true,
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView enabled behavior="padding" style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 200, height: 200 }}
      />
      <Text style={styles.headerText}>Register</Text>
      <View style={styles.inputView}>
        <Icon
          style={styles.inputIcon}
          type="font-awesome"
          name="user"
          color="#85089e"
          size={20}
        />
        <TextInput
          style={styles.inputText}
          placeholder="Username"
          placeholderTextColor="white"
          autoFocus
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputView}>
        <Icon
          style={styles.inputIcon}
          type="font-awesome"
          name="envelope"
          color="#85089e"
          size={20}
        />
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="white"
          autoFocus
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputView}>
        <Icon
          style={styles.inputIcon}
          type="font-awesome"
          name="lock"
          color="#85089e"
          size={20}
        />
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="white"
          value={password}
          onChangeText={setPassword}
          // onSubmitEditing={register}
        />
      </View>
      <TouchableOpacity style={styles.submitBtn}>
        <Text style={styles.submitBtnText} onPress={register}>
          Sign Up{" "}
          <Icon
            type="font-awesome"
            name="long-arrow-right"
            color="white"
            size={16}
          />
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontFamily: "serif",
    color: "white",
    fontSize: 40,
    paddingBottom: 20,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#3d3d3b",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    padding: 10,
  },
  inputText: {
    height: 50,
    color: "white",
    fontSize: 16,
    fontFamily: "serif",

    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
  },
  submitBtn: {
    width: "50%",
    backgroundColor: "#85089e",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  submitBtnText: {
    color: "white",
    fontFamily: "serif",
    fontSize: 16,
  },
});

export default RegisterScreen;
