import { CometChat } from "@cometchat-pro/react-native-chat";
import { RouteProp } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  DeviceEventEmitter,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import uuid from "react-native-uuid";
import ProfilePicture from "../components/ProfilePicture";

type RootStackParamList = {
  Chat: { user: CometChat.User; recipient: CometChat.User };
};

type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

type ChatScreenProps = {
  route: ChatScreenRouteProp;
  navigation: any;
};

const ChatScreen = ({ route, navigation }: ChatScreenProps) => {
  const { user, recipient } = route.params;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<CometChat.BaseMessage[]>([]);
  const [recipientIsTyping, setRecipientIsTyping] = useState(false);
  const scrollViewRef = useRef();

  const receiverId = recipient.getUid();
  const receiverType = CometChat.RECEIVER_TYPE.USER;

  const typingNotification = new CometChat.TypingIndicator(
    receiverId,
    receiverType
  );

  useEffect(() => {
    navigation.setOptions({
      title: recipient.getName(),
      headerShown: true,
      headerBackVisible: true,
      headerStyle: { backgroundColor: "black" },
      headerTitleStyle: { color: "white" },
      headerLeft: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Icon
            name="chevron-left"
            type="font-awesome"
            iconStyle={{ color: "white", paddingRight: 10, paddingLeft: 5 }}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <ProfilePicture user={recipient} size={35} />
        </View>
      ),
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontFamily: "serif", fontSize: 16 }}>
            {recipient.getName()}
          </Text>
        </View>
      ),
    });
  });

  useEffect(() => {
    listenForMessages();
    listenForTypingIndicator();
    fetchMessages();
  }, []);

  const listenForMessages = () => {
    const listenerID = uuid.v4().toString();

    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (textMessage: CometChat.BaseMessage) => {
          console.log("Text message received successfully");
          // Handle text message
          fetchMessages();
        },
        // onMediaMessageReceived: (mediaMessage: any) => {
        //   console.log("Media message received successfully", mediaMessage);
        //   // Handle media message
        // },
      })
    );
  };

  const listenForTypingIndicator = () => {
    const listenerID = uuid.v4().toString();

    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTypingStarted: (typingIndicator: any) => {
          setRecipientIsTyping(true);
          console.log("Typing started :", typingIndicator);
        },
        onTypingEnded: (typingIndicator: any) => {
          setRecipientIsTyping(false);
          console.log("Typing ended :", typingIndicator);
        },
      })
    );
  };

  const fetchMessages = () => {
    if (user && recipient) {
      const UID = recipient.getUid();
      const limit = 50;

      const messagesRequest = new CometChat.MessagesRequestBuilder()
        .setLimit(limit)
        .setUID(UID)
        .build();

      messagesRequest.fetchPrevious().then(
        (messagesList) => {
          // console.log("Message list fetched:", messagesList);
          // Handle the list of messages
          setMessages(messagesList);
        },
        (error) => {
          console.log("Message fetching failed with error:", error);
        }
      );
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd();
    }
  }, [messages]);

  const sendMessage = () => {
    // Keyboard.dismiss();

    if (input) {
      const textMessage = new CometChat.TextMessage(
        recipient.getUid(),
        input,
        CometChat.RECEIVER_TYPE.USER
      );

      CometChat.sendMessage(textMessage).then(
        (message) => {
          // console.log("Message sent successfully:", message);
          fetchMessages();
          DeviceEventEmitter.emit("updateConversationList");
        },
        (error) => {
          console.log("Message sending failed with error:", error);
        }
      );
      setInput("");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={125}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={{ paddingTop: 15 }}
            >
              {messages.map((message) =>
                message.getSender().getUid() === user.getUid() ? (
                  <View key={message.getId()} style={styles.userContainer}>
                    <View
                      style={[
                        styles.messageContainer,
                        { backgroundColor: "#3d3d3b", alignSelf: "flex-end" },
                      ]}
                    >
                      <Text style={styles.messageText}>
                        {message.data.text}
                      </Text>
                    </View>
                    <ProfilePicture user={user} size={20} />
                  </View>
                ) : (
                  <View key={message.getId()} style={styles.recipientContainer}>
                    <ProfilePicture user={recipient} size={20} />
                    <View
                      style={[
                        styles.messageContainer,
                        { backgroundColor: "black", alignSelf: "flex-start" },
                      ]}
                    >
                      <Text style={styles.messageText}>
                        {message.data.text}
                      </Text>
                    </View>
                  </View>
                )
              )}
            </ScrollView>
            {recipientIsTyping && (
              <View style={{ paddingLeft: 20 }}>
                <Text style={{ color: "white" }}>
                  {recipient.getName()} is typing...
                </Text>
              </View>
            )}
            <View style={styles.footer}>
              <TextInput
                style={styles.textInput}
                placeholder="Aa"
                value={input}
                onSubmitEditing={sendMessage}
                onChangeText={(text) => {
                  setInput(text);
                  CometChat.startTyping(typingNotification);
                }}
                onEndEditing={() => {
                  CometChat.endTyping(typingNotification);
                }}
              />
              <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                <Icon name="paper-plane" type="font-awesome" color="white" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    flex: 1,
    bottom: 0,
    height: 40,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    borderRadius: 30,

    borderWidth: 2,
    borderColor: "#85089e",
  },
  messageContainer: {
    padding: 10,
    borderRadius: 20,
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
    borderColor: "#85089e",
    borderWidth: 2,
  },
  messageText: {
    color: "white",
    fontFamily: "serif",
  },
  userContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  recipientContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
  },
});

export default ChatScreen;
