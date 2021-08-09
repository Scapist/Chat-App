import { CometChat } from "@cometchat-pro/react-native-chat";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon, SearchBar } from "react-native-elements";
import ProfilePicture from "./ProfilePicture";

type FriendsListProps = {
  users: CometChat.User[];
  unfriendUser: any;
  openChat: any;
};

const FriendsList = ({ users, unfriendUser, openChat }: FriendsListProps) => {
  const [search, setSearch] = useState<string>("");
  const [dataList, setDataList] = useState<CometChat.User[]>();

  useEffect(() => {
    setDataList(users);
  }, [users]);

  useEffect(() => {
    if (users) {
      setDataList(
        users.filter((el) =>
          el.getName().toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search]);

  const updateSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={updateSearch}
        value={search}
      />
      <View style={styles.body}>
        <FlatList
          data={dataList}
          keyExtractor={(item: CometChat.User) => {
            return item.getUid();
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  openChat(item);
                }}
              >
                <View style={styles.box}>
                  <ProfilePicture user={item} size={50} />
                  <Text style={styles.username}>{item.getName()}</Text>
                  <View style={styles.unfriendButtonContainer}>
                    <Icon
                      raised
                      name="user-times"
                      type="font-awesome"
                      color="#85089e"
                      size={20}
                      onPress={() => {
                        unfriendUser(item);
                        // setSearch("");
                      }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  body: {
    backgroundColor: "black",
  },
  box: {
    padding: 5,
    marginTop: 5,
    backgroundColor: "black",
    flexDirection: "row",

    borderColor: "#85089e",
    borderWidth: 2,
    borderRadius: 25,
  },
  username: {
    fontFamily: "serif",
    color: "white",
    fontSize: 14,
    alignSelf: "center",
    marginLeft: 10,
  },

  unfriendButtonContainer: {
    marginLeft: "auto",
    marginTop: "auto",
    marginBottom: "auto",
  },
});

export default FriendsList;
