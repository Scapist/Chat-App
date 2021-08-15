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
import uuid from "react-native-uuid";
import ChatListItem from "../components/ChatListItem";

type ChatsScreenProps = {
  navigation: any;
  user: CometChat.User;
};

const SEARCH_LIMIT = 30;

const ConversationsScreen = ({ navigation, user }: ChatsScreenProps) => {
  const [conversationList, setConversationList] = useState<
    CometChat.Conversation[]
  >();

  useEffect(() => {
    listenForMessages();
    fetchAllConversations();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchAllConversations();
    });
    return unsubscribe;
  }, [navigation]);

  const forceUpdate = () => {
    fetchAllConversations();
  };

  const fetchAllConversations = () => {
    const conversationsRequest = new CometChat.ConversationsRequestBuilder()
      .setLimit(SEARCH_LIMIT)
      .setConversationType(CometChat.RECEIVER_TYPE.USER)
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

  const listenForMessages = () => {
    const listenerID = uuid.v4().toString();

    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (textMessage: CometChat.BaseMessage) => {
          console.log("Text message received successfully");
          // Handle text message
          fetchAllConversations();
        },
        // onMediaMessageReceived: (mediaMessage: any) => {
        //   console.log("Media message received successfully", mediaMessage);
        //   // Handle media message
        // },
      })
    );
  };

  const openChat = (recipient: CometChat.User) => {
    navigation.navigate("ChatScreen", {
      user,
      recipient,
    });
  };

  const deleteConversationForUser = (conversationSettingsId: string) => {
    CometChat.deleteConversation(
      conversationSettingsId,
      CometChat.RECEIVER_TYPE.USER
    ).then(
      (deletedConversation) => {
        console.log(deletedConversation);
        forceUpdate();
      },
      (error) => {
        console.log("error while deleting a conversation", error);
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
        <ChatListItem
          conversationList={conversationList}
          deleteConversation={deleteConversationForUser}
          openChat={openChat}
        />
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

export default ConversationsScreen;
