import { CometChat } from "@cometchat-pro/react-native-chat";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import ProfilePicture from "./ProfilePicture";

type UserListProps = {
  users: CometChat.User[];
  addFriend: any;
};

const UserList = ({ users, addFriend }: UserListProps) => {
  const [search, setSearch] = useState<string>("");
  const [dataList, setDataList] = useState<CometChat.User[]>();

  useEffect(() => {
    setDataList([...users]);
  }, [users]);

  useEffect(() => {
    setDataList(users.filter((el) => el.getName().includes(search)));
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
              <TouchableOpacity>
                <View style={styles.box}>
                  <ProfilePicture user={item} size={50} />
                  <Text style={styles.username}>{item.getName()}</Text>
                  <Button
                    buttonStyle={styles.addBtn}
                    containerStyle={styles.addBtnContainer}
                    title="Add Friend "
                    onPress={() => {
                      addFriend(item);
                      setSearch("");
                    }}
                    iconRight
                    icon={<Icon name="plus-circle" color="white" size={16} />}
                  />
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
  addBtn: {
    backgroundColor: "#85089e",
    borderRadius: 25,
    fontFamily: "serif",
  },
  addBtnContainer: {
    marginLeft: "auto",
    marginTop: "auto",
    marginBottom: "auto",
  },
});

export default UserList;
