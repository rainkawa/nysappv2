import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Requests from "../components/follow/Requests";
import Interaction from "../components/notifications/Interaction";
import useFetchRequests from "../hooks/useFetchRequests";
import useFetchNotifications from "../hooks/useFetchNotifications";
import { LinearGradient } from "expo-linear-gradient";
import { SIZES } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";

const Notifications = ({ navigation, route }) => {
  const currentUser = route?.params?.currentUser;

  const {
    notifications = [],
  } = useFetchNotifications({
    user: currentUser,
  });

  const {
    requests = [],
  } = useFetchRequests({
    user: currentUser,
  });

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.footerContainer}>
          <Text style={styles.title}>
            User information unavailable
          </Text>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.button}>
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const activeNotifications = notifications.filter(
    (item) => item?.deleted !== true
  );

  const hasContent =
    requests.length > 0 ||
    activeNotifications.length > 0;

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom"]}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.titleContainer}
      >
        <MaterialIcons
          name="arrow-back-ios"
          size={22}
          color="#fff"
        />

        <Text style={styles.textTitle}>
          Notifications
        </Text>
      </TouchableOpacity>

      {hasContent ? (
        <FlatList
          data={[
            ...requests.map((request, index) => ({
              type: "request",
              id: `request-${request?.email || index}`,
              request,
            })),

            ...activeNotifications.map(
              (notification) => ({
                type: "notification",
                id: `notification-${notification.id}`,
                notification,
              })
            ),
          ]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            if (item.type === "request") {
              return (
                <Requests
                  user={item.request}
                  currentUser={currentUser}
                  navigation={navigation}
                />
              );
            }

            return (
              <Interaction
                navigation={navigation}
                notification={item.notification}
                currentUser={currentUser}
              />
            );
          }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={{ height: 40 }} />
          }
        />
      ) : (
        <View style={styles.footerContainer}>
          <LinearGradient
            start={[0.9, 0.45]}
            end={[0.07, 1.03]}
            colors={[
              "#ff00ff",
              "#ff4400",
              "#ffff00",
            ]}
            style={styles.rainbowBorder}
          >
            <AntDesign
              name="checkcircle"
              size={58}
              color="#000"
            />
          </LinearGradient>

          <Text style={styles.title}>
            No notifications for now
          </Text>

          <Text style={styles.text}>
            There are no notifications yet.
          </Text>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.button}>
              Back to home
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 0,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom:
      Platform.OS === "android" ? 20 : 4,
    gap: 3,
  },

  textTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
    transform: [{ scaleY: 1.1 }],
  },

  footerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: SIZES.Height * 0.18,
    gap: 10,
  },

  rainbowBorder: {
    padding: 3,
    height: 63.5,
    width: 63.5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  text: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
  },

  button: {
    color: "#09f",
    fontSize: 16,
    fontWeight: "700",
  },
});
