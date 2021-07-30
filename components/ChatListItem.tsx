import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ProfilePicture from "./ProfilePicture";

const ChatListItem = () => {
  const [lastMessage, setlastMessage] = useState("");
  const [lastMessageTimestamp, setlastMessageTimestamp] = useState("");

  return (
    <View>
      <ProfilePicture />
      <Text style={styles.textStyle}>Chat name</Text>
      <Text style={styles.textStyle}>lastMessage</Text>
      <Text style={styles.textStyle}>timestamp</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    color: "white",
  },
});

export default ChatListItem;
