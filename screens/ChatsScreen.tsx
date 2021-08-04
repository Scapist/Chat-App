import { CometChat } from "@cometchat-pro/react-native-chat";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ChatListItem from "../components/ChatListItem";

const SEARCH_LIMIT = 30;

const ChatsScreen = () => {
  const [conversationList, setConversationList] = useState<
    CometChat.Conversation[]
  >();

  useEffect(() => {
    fetchAllConversations();
  }, []);

  const fetchAllConversations = () => {
    const conversationsRequest = new CometChat.ConversationsRequestBuilder()
      .setLimit(SEARCH_LIMIT)
      .setConversationType("user")
      .build();

    conversationsRequest.fetchNext().then(
      (userConversationList) => {
        console.log("Conversations list received");
        setConversationList(userConversationList);
      },
      (error) => {
        console.log("Conversations list fetching failed with error:", error);
      }
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: "black" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.conversationWrapperStyle}
      >
        <View style={[styles.conversationHeaderStyle]}>
          <View style={styles.headingContainer}>
            <Text style={styles.conversationHeaderTitleStyle}>Chats</Text>
          </View>
        </View>
        <ChatListItem conversationList={conversationList} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  conversationWrapperStyle: {
    height: "100%",
    backgroundColor: "black",
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conversationHeaderStyle: {
    paddingBottom: 32,
    position: "relative",
    paddingHorizontal: 20,
  },
  conversationHeaderTitleStyle: {
    margin: 0,
    fontWeight: "700",
    textAlign: "left",
    fontSize: 28,
    color: "white",
    paddingTop: 20,
  },
});

export default ChatsScreen;
