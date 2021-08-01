import { CometChat } from "@cometchat-pro/react-native-chat";
import React from "react";
import { View } from "react-native";
import { Image } from "react-native-elements";

type ProfilePictureProps = {
  user: CometChat.User;
  size: number;
};

const ProfilePicture = ({ user, size }: ProfilePictureProps) => {
  const getImage = () => {
    return user && user.getAvatar()
      ? { uri: user.getAvatar() }
      : require("../assets/blank_profile_picture.png");
  };

  return (
    <View>
      <Image
        source={getImage()}
        style={{
          width: size,
          height: size,
          borderRadius: 100,
          borderColor: "#85089e",
          borderWidth: 1,
        }}
      />
    </View>
  );
};

export default ProfilePicture;
