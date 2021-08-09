import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BottomSheet, ListItem } from "react-native-elements";
import { ActionListItem } from "../classes/ActionList";

type BottomOverlayProps = {
  isVisible: boolean;
  actionList: ActionListItem[];
};

const BottomOverlay = ({ isVisible, actionList }: BottomOverlayProps) => {
  return (
    <View>
      <BottomSheet
        isVisible={isVisible}
        containerStyle={{
          backgroundColor: "rgba(0.5, 0.25, 0, 0.7)",
        }}
      >
        {actionList.map((item: ActionListItem, index: number) => (
          <ListItem
            key={index}
            containerStyle={[styles.containerStyle, item.containerStyle]}
            onPress={item.onPress}
          >
            <ListItem.Content>
              <ListItem.Title style={styles.titleStyle}>
                {item.title}
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: "black",
  },
  titleStyle: {
    fontFamily: "serif",
    color: "white",
  },
});
export default BottomOverlay;
