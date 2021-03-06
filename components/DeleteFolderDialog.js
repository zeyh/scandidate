import React, { useEffect, useState } from "react";
import { firebase } from "../firebase";
import { Alert, StyleSheet, View, FlatList } from "react-native";
import {
  Checkbox,
  Button,
  Modal,
  Text,
  Dialog,
  useTheme,
} from "react-native-paper";

let db =
  firebase.auth() && firebase.auth().currentUser
    ? firebase
        .database()
        .ref("users/" + firebase.auth().currentUser.uid + "/Folders")
    : null;

const DeleteFolderDialog = ({
  setDeleteFolderVisible,
  deleteFolderVisible,
  selectedFolder,
}) => {
  const { colors } = useTheme();

  // database
  useEffect(() => {
    db =
      firebase.auth() && firebase.auth().currentUser
        ? firebase
            .database()
            .ref("users/" + firebase.auth().currentUser.uid + "/Folders")
        : null;

    const handleData = (snapshot) => {
      if (snapshot.val()) {
      }
    };
    db.on("value", handleData, (error) => alert(error));
    return () => {
      db.off("value", handleData);
    };
  }, []);

  //delete folder from the db
  const deleteButton = () => {
    db.child(selectedFolder)
      .remove()
      .catch((error) => {
        alert(error.message);
      });
    setDeleteFolderVisible(false);
  };

  return (
    <Dialog
      style={{ backgroundColor: colors.background }}
      visible={deleteFolderVisible}
      onDismiss={() => {
        setDeleteFolderVisible(false);
      }}
    >
      <Dialog.Title>Are you sure you want to delete this folder?</Dialog.Title>
      <Dialog.Content>
        <Text>This action cannot be reversed.</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          onPress={() => {
            setDeleteFolderVisible(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onPress={() => {
            deleteButton();
          }}
        >
          Delete
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default DeleteFolderDialog;
