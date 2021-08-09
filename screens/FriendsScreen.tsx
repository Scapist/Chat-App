import { CometChat } from "@cometchat-pro/react-native-chat";
import axios from "axios";
import React from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import FriendsList from "../components/FriendsList";
import { COMETCHAT_CONSTANTS } from "../constants";

type FriendsScreenProps = {
  navigation: any;
  user: CometChat.User;
  friendsList: CometChat.User[];
};

const FriendsScreen = ({
  navigation,
  user,
  friendsList,
}: FriendsScreenProps) => {
  const unfriendUser = (friend: CometChat.User) => {
    if (user) {
      const url = `https://api-us.cometchat.io/v2.0/users/${user.getUid()}/friends`;
      const headers = {
        appId: COMETCHAT_CONSTANTS.APP_ID,
        apiKey: COMETCHAT_CONSTANTS.API_KEY,
      };

      axios.delete(url, { data: { friends: [friend.getUid()] }, headers }).then(
        (response) => {
          DeviceEventEmitter.emit("friendChange");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  const openChat = (recipient: CometChat.User) => {
    navigation.navigate("ChatScreen", {
      user,
      recipient,
    });
  };

  return (
    <View style={styles.container}>
      <FriendsList
        users={friendsList}
        unfriendUser={unfriendUser}
        openChat={openChat}
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
    paddingBottom: 68,
  },
});

export default FriendsScreen;
