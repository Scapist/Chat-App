import { CometChat } from "@cometchat-pro/react-native-chat";
import React, { useLayoutEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Icon, Image } from "react-native-elements";
import { COMETCHAT_CONSTANTS } from "../constants";
import { auth } from "../firebase";

const RegisterScreen = ({ navigation, setUserCallback }) => {
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

          const cometChatUser = new CometChat.User(user.uid);

          cometChatUser.setName(username);

          CometChat.createUser(
            cometChatUser,
            COMETCHAT_CONSTANTS.AUTH_KEY
          ).then(
            (createdUser) => {
              console.log("user created", createdUser);

              CometChat.login(user.uid, COMETCHAT_CONSTANTS.AUTH_KEY).then(
                (loggedUser) => {
                  console.log("Login Successful:", { loggedUser });
                  // User loged in successfully.
                  setUserCallback(loggedUser);
                },
                (error) => {
                  console.log("Login failed with exception:", { error });
                  // User login failed, check error and take appropriate action.
                }
              );
            },
            (error) => {
              console.log("error", error);
            }
          );
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
          onSubmitEditing={register}
        />
      </View>
      <Button
        buttonStyle={styles.submitBtn}
        containerStyle={styles.submitBtnContainer}
        title="Sign Up "
        onPress={register}
        iconRight
        icon={
          <Icon
            type="font-awesome"
            name="long-arrow-right"
            color="white"
            size={16}
          />
        }
      />
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
    backgroundColor: "#85089e",
    borderRadius: 25,
  },
  submitBtnContainer: {
    paddingTop: 20,
    width: "50%",
  },
});

export default RegisterScreen;
