import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { useUserContext } from "../../../contexts/UserContext";
import { SafeAreaView } from "react-native-safe-area-context";

const Privacy = ({ navigation }) => {
  const { currentUser } = useUserContext();

  const [isPrivate, setIsPrivate] =
    useState(currentUser?.isPrivate === true);

  const [loader, setLoader] =
    useState(false);

  const handleSave = async () => {
    if (!currentUser?.email || loader) {
      return;
    }

    setLoader(true);

    try {
      await updateDoc(
        doc(db, "users", currentUser.email),
        {
          isPrivate,
        }
      );

      navigation.goBack();
    } catch (error) {
      console.error(
        "Privacy update error:",
        error
      );
    } finally {
      setLoader(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons
            name="arrow-back-ios"
            size={23}
            color="#fff"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Account privacy
        </Text>

        {loader ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <TouchableOpacity
            onPress={handleSave}
          >
            <Text style={styles.done}>
              Done
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.info}>
          Private accounts require approval before
          someone can follow you.
        </Text>

        <TouchableOpacity
          style={styles.option}
          onPress={() => setIsPrivate(false)}
        >
          <View>
            <Text style={styles.optionTitle}>
              Public
            </Text>

            <Text style={styles.optionDescription}>
              Anyone can follow you.
            </Text>
          </View>

          <View style={styles.radio}>
            {!isPrivate && (
              <View style={styles.radioActive} />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => setIsPrivate(true)}
        >
          <View>
            <Text style={styles.optionTitle}>
              Private
            </Text>

            <Text style={styles.optionDescription}>
              You approve follow requests.
            </Text>
          </View>

          <View style={styles.radio}>
            {isPrivate && (
              <View style={styles.radioActive} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Privacy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  header: {
    height: 52,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  done: {
    color: "#09f",
    fontSize: 16,
    fontWeight: "700",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  info: {
    color: "#888",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },

  option: {
    minHeight: 72,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  optionDescription: {
    color: "#888",
    fontSize: 13,
    marginTop: 4,
  },

  radio: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#777",
    justifyContent: "center",
    alignItems: "center",
  },

  radioActive: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#09f",
  },
});
