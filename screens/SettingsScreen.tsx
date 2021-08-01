import { CometChat } from "@cometchat-pro/react-native-chat";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar, Button } from "react-native-elements";
import uuid from "react-native-uuid";
import Icon from "react-native-vector-icons/FontAwesome";
import ProfilePicture from "../components/ProfilePicture";
import { auth, storage } from "../firebase";

type SettingsScreenProps = {
  navigation: any;
  user: CometChat.User;
};

const SettingsScreen = ({ navigation, user }: SettingsScreenProps) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageUploadUrl, setImageUploadUrl] = useState<string>("");

  useEffect(() => {
    if (user && imageUploadUrl !== user.getAvatar()) {
      user.setAvatar(imageUploadUrl);

      CometChat.updateCurrentUserDetails(user).then(
        (updatedUser) => {
          // console.log("user updated", updatedUser);
          console.log("user updated");
        },
        (error) => {
          console.log("error", error);
        }
      );
    }
  }, [imageUploadUrl]);

  const changeProfilePicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    handleImagePicked(result);
  };

  // TODO: change any
  const handleImagePicked = async (pickerResult: any) => {
    try {
      setUploading(true);

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri);
        setImageUploadUrl(uploadUrl);
      }
    } catch (error) {
      console.log(error);
      alert("Upload failed, sorry :(");
    } finally {
      setUploading(false);
    }
  };

  const uploadImageAsync = async (uri: string) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob: any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = (error) => {
        console.log(error);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = storage.ref().child(uuid.v4().toString());
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    const downloadURL = await snapshot.ref.getDownloadURL();

    return downloadURL;
  };

  const logout = () => {
    auth
      .signOut()
      .then(() => {
        // Sign-out successful.
        CometChat.logout().then(
          () => {
            console.log("Logout completed successfully");
          },
          // Logout completed successfully
          (error) => {
            // Logout failed with exception
            console.log("Logout failed with exception:", { error });
          }
        );
        navigation.replace("Login");
      })
      .catch((error) => {
        // An error happened.
        alert(error.message);
      });
  };

  const getName = () => {
    if (user) {
      console.log("found", user);
    }
    return user ? user.getName() : "";
  };

  return (
    <View style={styles.container}>
      <View>
        <ProfilePicture user={user} size={200} />
        <Avatar.Accessory
          name="pencil"
          type="font-awesome"
          size={25}
          onPress={changeProfilePicture}
        />
      </View>
      <Text style={styles.usernameStyle}>{getName()}</Text>
      <Button
        buttonStyle={styles.submitBtn}
        containerStyle={styles.submitBtnContainer}
        title="Logout "
        onPress={logout}
        iconRight
        icon={<Icon name="sign-out" color="white" size={16} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtn: {
    backgroundColor: "#85089e",
    borderRadius: 25,
    fontFamily: "serif",
  },
  submitBtnContainer: {
    paddingTop: 20,
    width: "50%",
  },
  usernameStyle: {
    color: "white",
    fontFamily: "serif",
    fontSize: 20,
    textAlign: "center",
  },
});

export default SettingsScreen;
