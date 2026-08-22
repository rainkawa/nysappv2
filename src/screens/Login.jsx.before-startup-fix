import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  useState,
  useEffect,
} from "react";
import {
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useUserContext } from "../contexts/UserContext";
import {
  SafeAreaView,
} from "react-native-safe-area-context";

const Login = ({
  navigation,
}) => {
  const { currentUser } =
    useUserContext();

  const [identifier, setIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    secureText,
    setSecureText,
  ] = useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (currentUser) {
      return;
    }
  }, [currentUser]);

  const findEmailByUsername =
    async (username) => {
      const normalized =
        username
          .trim()
          .toLowerCase();

      const lowerSnapshot =
        await getDocs(
          query(
            collection(db, "users"),
            where(
              "usernameLower",
              "==",
              normalized
            )
          )
        );

      if (!lowerSnapshot.empty) {
        return (
          lowerSnapshot.docs[0]
            .data()?.email ||
          null
        );
      }

      const fallbackSnapshot =
        await getDocs(
          query(
            collection(db, "users"),
            where(
              "username",
              "==",
              username.trim()
            )
          )
        );

      if (!fallbackSnapshot.empty) {
        return (
          fallbackSnapshot.docs[0]
            .data()?.email ||
          null
        );
      }

      return null;
    };

  const handleLogin = async () => {
    if (loading) return;

    const cleanIdentifier =
      identifier.trim();

    if (
      !cleanIdentifier ||
      !password
    ) {
      setError(
        "Enter your username/email and password."
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      let loginEmail =
        cleanIdentifier;

      if (
        !cleanIdentifier.includes("@")
      ) {
        const foundEmail =
          await findEmailByUsername(
            cleanIdentifier
          );

        if (!foundEmail) {
          setError(
            "Username or password is incorrect."
          );
          return;
        }

        loginEmail =
          foundEmail;
      } else {
        loginEmail =
          cleanIdentifier
            .toLowerCase();
      }

      await signInWithEmailAndPassword(
        auth,
        loginEmail,
        password
      );
    } catch (loginError) {
      console.error(
        "Login error:",
        loginError
      );

      switch (
        loginError?.code
      ) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError(
            "Username/email or password is incorrect."
          );
          break;

        case "auth/invalid-email":
          setError(
            "Enter a valid username or email."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Too many attempts. Try again later."
          );
          break;

        default:
          setError(
            "Login failed. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style={styles.content}>
        <Text
          style={styles.logo}
        >
          Login
        </Text>

        <View
          style={styles.inputField}
        >
          <TextInput
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              setError("");
            }}
            placeholder="Email or username"
            placeholderTextColor="#777"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.inputText}
            keyboardType={
              identifier.includes("@")
                ? "email-address"
                : "default"
            }
          />
        </View>

        <View
          style={styles.inputField}
        >
          <TextInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError("");
            }}
            placeholder="Password"
            placeholderTextColor="#777"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={secureText}
            style={styles.inputText}
          />

          <TouchableOpacity
            onPress={() =>
              setSecureText(
                (previous) =>
                  !previous
              )
            }
          >
            <MaterialCommunityIcons
              name={
                secureText
                  ? "eye-off"
                  : "eye"
              }
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {!!error && (
          <Text
            style={styles.errorText}
          >
            {error}
          </Text>
        )}

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              "Forgot"
            )
          }
          style={
            styles.forgotContainer
          }
        >
          <Text
            style={styles.forgotText}
          >
            Forgot password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
        >
          <View
            style={[
              styles.loginButton,
              loading &&
                styles.disabledButton,
            ]}
          >
            {loading ? (
              <ActivityIndicator
                color="#fff"
              />
            ) : (
              <Text
                style={
                  styles.loginButtonText
                }
              >
                Log in
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              "Signup"
            )
          }
          style={styles.signup}
        >
          <Text
            style={styles.signupText}
          >
            Create new account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  logo: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    alignSelf: "center",
    marginBottom: 30,
  },

  inputField: {
    minHeight:
      Platform.OS === "android"
        ? 54
        : 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#111",
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  inputText: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    marginRight: 8,
  },

  errorText: {
    color: "#ff4d61",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
    marginBottom: 4,
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginTop: 2,
    marginBottom: 20,
  },

  forgotText: {
    color: "#19f",
    fontWeight: "700",
  },

  loginButton: {
    height:
      Platform.OS === "android"
        ? 54
        : 52,
    borderRadius: 10,
    backgroundColor: "#07f",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.55,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  signup: {
    alignSelf: "center",
    marginTop: 24,
  },

  signupText: {
    color: "#19f",
    fontSize: 14,
    fontWeight: "700",
  },
});
