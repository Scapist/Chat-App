import { CometChat } from "@cometchat-pro/react-native-chat";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import UserList from "../components/UserList";
import { COMETCHAT_CONSTANTS } from "../constants";

const SEARCH_LIMIT = 30;

type UsersScreenProps = {
  navigation: any;
  user: CometChat.User;
};
const UsersScreen = ({ user }: UsersScreenProps) => {
  const [users, setUsers] = useState<CometChat.User[]>();

  useEffect(() => {
    console.log("here", user);
  }, []);

  useEffect(() => {
    const usersRequest = new CometChat.UsersRequestBuilder()
      .setLimit(SEARCH_LIMIT)
      .build();

    usersRequest.fetchNext().then(
      (userList) => {
        /* userList will be the list of User class. */
        console.log("User list received:", userList);
        /* retrived list can be used to display contact list. */
        setUsers(userList);
      },
      (error) => {
        console.log("User list fetching failed with error:", error);
      }
    );
  }, []);

  const addFriend = (friend: CometChat.User) => {
    console.log(user);
    if (user) {
      console.log(friend);
      const url = `https://api-us.cometchat.io/v2.0/users/${user.getUid()}/friends`;
      const headers = {
        appId: COMETCHAT_CONSTANTS.APP_ID,
        apiKey: COMETCHAT_CONSTANTS.API_KEY,
      };

      axios.post(url, { accepted: [friend.getUid()] }, { headers }).then(
        (response) => {
          console.log("friend added", response);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  return (
    <View style={styles.container}>
      <UserList users={users} addFriend={addFriend} />
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

export default UsersScreen;
