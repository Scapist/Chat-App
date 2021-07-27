import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import "react-native-gesture-handler";
import { auth } from "../firebase";

type RootStackParamList = {
  SplashScreen: undefined;
  Login: undefined;
};

type SplashScreennNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SplashScreen"
>;

type Props = {
  navigation: SplashScreennNavigationProp;
};

const SplashScreen = ({ navigation }: Props) => {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    if (animation.current) animation.current.play(51, 178);
  });

  const onSplashEnd = () => {
    navigation.replace(auth.currentUser ? "Home" : "Login");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000000",
      }}
    >
      <LottieView
        ref={animation}
        source={require("../assets/splashscreen.json")}
        loop={false}
        onAnimationFinish={onSplashEnd}
      />
    </View>
  );
};

export default SplashScreen;
