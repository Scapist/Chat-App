import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, Image } from "react-native-elements";
import { useAlertModal } from "../components/useAlertModal";
import { auth } from "../firebase";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const alertModal = useAlertModal();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);

  const signIn = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const openForgotPasswordOverlay = async () => {
    await alertModal.show({
      title: "Forgot Password?",
      message: "Relax! Try to remember.",
    });
  };

  return (
    <KeyboardAvoidingView enabled behavior="padding" style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 200, height: 200 }}
      />
      <Text style={styles.headerText}>Login</Text>
      <Text style={styles.headerSubText}>Please sign in to continue</Text>
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
          // onSubmitEditing={signIn}
        />
      </View>
      <TouchableOpacity>
        <Text style={styles.forgot} onPress={openForgotPasswordOverlay}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitBtn}>
        <Text style={styles.submitBtnText} onPress={signIn}>
          LOGIN{" "}
          <Icon
            type="font-awesome"
            name="long-arrow-right"
            color="white"
            size={16}
          />
        </Text>
      </TouchableOpacity>
      <View style={styles.noAccountContainer}>
        <Text style={styles.noAccountText}>Don't have an account yet? </Text>
        <TouchableOpacity style={{ paddingBottom: 0 }}>
          <Text
            style={styles.signUp}
            onPress={() => navigation.navigate("Register")}
          >
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
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
  },
  headerSubText: {
    fontFamily: "serif",
    color: "#3d3d3b",
    fontSize: 20,
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
  forgot: {
    color: "#85089e",
    fontFamily: "serif",
    fontSize: 14,
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
  noAccountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    position: "absolute",
    bottom: 30,
    paddingTop: 15,
  },
  noAccountText: {
    color: "white",
    fontFamily: "serif",
    fontSize: 14,
  },
  signUp: {
    color: "#85089e",
    fontFamily: "serif",
    fontSize: 14,
  },
});

export default LoginScreen;
