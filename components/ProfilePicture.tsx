import { CometChat } from "@cometchat-pro/react-native-chat";
import React from "react";
import { View } from "react-native";
import { Image } from "react-native-elements";

type ProfilePictureProps = {
  user: CometChat.User;
  width: number;
  height: number;
};

const ProfilePicture = ({ user, width, height }: ProfilePictureProps) => {
  const getImage = () => {
    return user && user.getAvatar()
      ? { uri: user.getAvatar() }
      : require("../assets/blank_profile_picture.png");
  };

  return (
    <View>
      <Image source={getImage()} style={{ width, height, borderRadius: 100 }} />
    </View>
  );
};

export default ProfilePicture;
