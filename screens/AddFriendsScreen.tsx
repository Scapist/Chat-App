import { CometChat } from "@cometchat-pro/react-native-chat";
import axios from "axios";
import React from "react";
import { StyleSheet, View } from "react-native";
import UserList from "../components/UserList";
import { COMETCHAT_CONSTANTS } from "../constants";

type UsersScreenProps = {
  navigation: any;
  user: CometChat.User;
  nonFriendsList: CometChat.User[];
  forceUpdate: any;
};

const UsersScreen = ({
  user,
  nonFriendsList,
  forceUpdate,
}: UsersScreenProps) => {
  const addFriend = (friend: CometChat.User) => {
    if (user) {
      const url = `https://api-us.cometchat.io/v2.0/users/${user.getUid()}/friends`;
      const headers = {
        appId: COMETCHAT_CONSTANTS.APP_ID,
        apiKey: COMETCHAT_CONSTANTS.API_KEY,
      };

      axios.post(url, { accepted: [friend.getUid()] }, { headers }).then(
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
      <UserList users={nonFriendsList} addFriend={addFriend} />
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

export default UsersScreen;
