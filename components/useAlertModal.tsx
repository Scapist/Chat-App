import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createUseModal } from "react-native-use-modal";

export const useAlertModal = createUseModal<
  void,
  { title: string; message: string }
>(
  ({ confirm, param }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.titleText}>{param.title}</Text>
        <Text style={styles.messageText}>{param.message}</Text>
        <TouchableOpacity style={styles.confirmButton} onPress={confirm}>
          <Text style={styles.confirmButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    );
  },
  {
    cancelOnBackButtonPress: true,
    cancelOnBackdropPress: true,
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3d3d3b",
    padding: 16,
    margin: 16,
    borderRadius: 14,
  },
  titleText: {
    fontSize: 20,
    fontFamily: "serif",
    color: "white",
    textAlign: "center",
  },
  messageText: {
    fontSize: 14,
    paddingTop: 10,
    fontFamily: "serif",
    color: "white",
    textAlign: "center",
  },
  confirmButton: {
    alignSelf: "center",
    backgroundColor: "#85089e",
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 16,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "white",
    fontFamily: "serif",
  },
});
