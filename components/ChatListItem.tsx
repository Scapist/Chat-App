import { CometChat } from "@cometchat-pro/react-native-chat";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomOverlay from "./BottomOverlay";
import ProfilePicture from "./ProfilePicture";

type ChatListItemProps = {
  navigation: any;
  conversationList: CometChat.Conversation[];
  deleteConversation: (conversationId: string) => {};
  openChat: (recipient: CometChat.User) => {};
};

const ChatListItem = ({
  navigation,
  conversationList,
  deleteConversation,
  openChat,
}: ChatListItemProps) => {
  const [conversationId, setConversationId] = useState("");
  const [
    conversationSettingsIsVisible,
    setConversationSettingsIsVisible,
  ] = useState(false);

  const conversationSettingsActionList = [
    {
      title: "Delete Conversation",
      onPress: () => {
        deleteConversation(conversationId);
        setConversationSettingsIsVisible(false);
      },
    },
    {
      title: "Cancel",
      containerStyle: { backgroundColor: "red" },
      onPress: () => {
        setConversationSettingsIsVisible(false);
      },
    },
  ];

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const today = new Date(Date.now());
    const oneDay = 1000 * 60 * 60 * 24;
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
    } else if ((today.getTime() - date.getTime()) / oneDay < 6) {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      formattedTimestamp = days[date.getDay()];
    } else {
      formattedTimestamp = today.toLocaleDateString("en-US");
    }
    return formattedTimestamp;
  };

  const openConversationSettings = (conversationWith: string) => {
    setConversationId(conversationWith);
    setConversationSettingsIsVisible(true);
  };

  useEffect(() => {
    console.log("Refreshed!");
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <FlatList
          data={conversationList}
          keyExtractor={(item: CometChat.Conversation) => {
            return item.getConversationId();
          }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  openChat(item.getConversationWith() as CometChat.User);
                }}
                onLongPress={() => {
                  openConversationSettings(
                    (item.getConversationWith() as CometChat.User).getUid()
                  );
                }}
              >
                <View style={styles.box}>
                  <ProfilePicture user={item.getConversationWith()} size={50} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.username}>
                      {item.getConversationWith().getName()}
                    </Text>
                    <Text
                      style={styles.lastMessage}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.getLastMessage().data.entities.sender.entity.name}
                      {": "}
                      {item.getLastMessage().data.text}
                    </Text>
                  </View>
                  <View style={styles.itemRight}>
                    {item.getUnreadMessageCount() !== 0 && (
                      <View style={styles.unreadMessageContainer}>
                        <Text style={styles.unreadMessageCount}>
                          {item.getUnreadMessageCount()}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.timestamp}>
                      {formatTimestamp(item.getLastMessage().sentAt)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <BottomOverlay
        isVisible={conversationSettingsIsVisible}
        actionList={conversationSettingsActionList}
      />
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
    alignItems: "center",
    flex: 1,

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

    marginLeft: 10,
    marginTop: 5,
    width: "65%",
  },
  timestamp: {
    fontFamily: "serif",
    color: "white",
    fontSize: 12,
    paddingRight: 10,
  },
  itemRight: {
    justifyContent: "center",
    alignItems: "center",
  },
  unreadMessageContainer: {
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#85089e",
    borderRadius: 15 / 2,
  },
  unreadMessageCount: {
    fontFamily: "serif",
    color: "white",
    fontSize: 12,
  },
});

export default ChatListItem;
