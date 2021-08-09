import { StyleProp, ViewStyle } from "react-native";

export interface ActionListItem {
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
  onPress: () => {};
}
