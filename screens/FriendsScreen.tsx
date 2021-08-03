import { CometChat } from "@cometchat-pro/react-native-chat";
import axios from "axios";
import React from "react";
import { StyleSheet, View } from "react-native";
import FriendsList from "../components/FriendsList";
import { COMETCHAT_CONSTANTS } from "../constants";

type FriendsScreenProps = {
  navigation: any;
  user: CometChat.User;
  friendsList: CometChat.User[];
  forceUpdate: any;
};

const FriendsScreen = ({
  user,
  friendsList,
  forceUpdate,
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
          forceUpdate();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      <FriendsList users={friendsList} unfriendUser={unfriendUser} />
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
});

export default FriendsScreen;
