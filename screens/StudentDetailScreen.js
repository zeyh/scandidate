import React, { useContext, useState, useEffect } from "react";
import { firebase } from "../firebase";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { useTheme, Button, Portal } from "react-native-paper";
import Profile from "./profile";
import FoldersModal from "../components/FoldersModal";

const Field = ({ label, value }) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.field}>{value}</Text>
    </View>
  );
};

const StudentDetailScreen = ({ route }) => {
  const [foldersVisible, setFoldersVisible] = useState(false);
  const [notesList, setNotesList] = useState([]);
  const hideFolders = () => setFoldersVisible(false);
  const openFolders = () => setFoldersVisible(true);

  const student = route.params.studData;
  const id = route.params.id;

  const { colors } = useTheme();

  // database to retrieve notes
  useEffect(() => {
    const db =
      firebase.auth() && firebase.auth().currentUser
        ? firebase
            .database()
            .ref("users/" + firebase.auth().currentUser.uid + "/Notes")
        : null;

    const handleData = (snapshot) => {
      if (snapshot.val()) {
        setNotesList(snapshot.val());
      }
    };
    db.on("value", handleData, (error) => alert(error));
    return () => {
      db.off("value", handleData);
    };
  }, []);

  const notesMsg = id in notesList ? notesList[id] : "Add a note ...";

  return (
    <SafeAreaView
      style={StyleSheet.compose(styles.container, {
        backgroundColor: colors.background,
      })}
    >
      <Button
        icon="plus"
        onPress={openFolders}
        //mode="contained"
        style={styles.button}
      >
        Add to Folder
      </Button>
      <ScrollView>
        <Profile student={student} />
        <Field label="Degree" value={student.qualifications.Degree} />
        <Field label="GPA" value={student.qualifications.GPA} />
        <Field
          label="Graduation Year"
          value={student.qualifications["Graduation Year"]}
        />
        <Field
          label="Skills"
          value={student.qualifications.skills.join(", ")}
        />
        <Field label="Notes" value={notesMsg} />
      </ScrollView>

      <Portal>
        <FoldersModal
          hideModal={hideFolders}
          modalVisible={foldersVisible}
          studentID={id}
        />
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between", //"center",
  },
  field: {
    height: 40,
    width: 400,
    padding: 5,
    backgroundColor: "white",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
  },
  button: {
    width: 200,
    height: 40,
  },
});

export default StudentDetailScreen;
