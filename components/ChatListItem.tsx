import { CometChat } from "@cometchat-pro/react-native-chat";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProfilePicture from "./ProfilePicture";

type ChatListItemProps = {
  conversationList: CometChat.Conversation[];
};

const ChatListItem = ({ conversationList }: ChatListItemProps) => {
  useEffect(() => {
    formatTimestamp(1627541084);
  }, []);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const today = new Date(Date.now());
    const one_day = 1000 * 60 * 60 * 24;
    let formattedTimestamp = "";

    if (date.toDateString() === today.toDateString()) {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'

      formattedTimestamp =
        (hours < 10 ? "0" + hours : hours) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes + " " + ampm);
    } else if ((today.getTime() - date.getTime()) / one_day) {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      formattedTimestamp = days[today.getDay()];
    } else {
      formattedTimestamp = today.toLocaleDateString("en-US");
    }

    return formattedTimestamp;
  };

  return (
    <View style={styles.container}>
      {/* <SearchBar
        placeholder="Type Here..."
        onChangeText={updateSearch}
        value={search}
      /> */}
      <View style={styles.body}>
        <FlatList
          data={conversationList}
          keyExtractor={(item: CometChat.Conversation) => {
            return item.getConversationId();
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity>
                <View style={styles.box}>
                  <ProfilePicture user={item.getConversationWith()} size={50} />
                  <Text style={styles.username}>
                    {item.getConversationWith().getName()}
                  </Text>
                  <Text
                    style={styles.lastMessage}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.getLastMessage()["data"]["text"]}
                  </Text>
                  <Text style={styles.username}>
                    {item.getUnreadMessageCount() === 0
                      ? ""
                      : item.getUnreadMessageCount()}
                  </Text>
                  <Text style={styles.timestamp}>
                    {formatTimestamp(item.getLastMessage()["sentAt"])}
                  </Text>
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
    marginLeft: 10,
  },
  lastMessage: {
    flex: 1,
    fontFamily: "serif",
    color: "white",
    fontSize: 12,
  },
  timestamp: {
    fontFamily: "serif",
    color: "white",
    fontSize: 12,
  },
});

export default ChatListItem;
