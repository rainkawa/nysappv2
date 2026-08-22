import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  useState,
  useEffect,
} from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import Validator from "email-validator";
import { getLocales } from "expo-localization";
import Animated, {
  FadeInDown,
  FadeOutDown,
} from "react-native-reanimated";
import { auth, db } from "../../services/firebase";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  doc,
} from "firebase/firestore";

const SignupForm = ({ navigation }) => {
  const [userOnFocus, setUserOnFocus] =
    useState(false);

  const [emailOnFocus, setEmailOnFocus] =
    useState(false);

  const [
    emailToValidate,
    setEmailToValidate,
  ] = useState(false);

  const [
    userToValidate,
    setUserToValidate,
  ] = useState(false);

  const [
    obsecureText,
    setObsecureText,
  ] = useState(true);

  const [
    passwordToValidate,
    setPasswordToValidate,
  ] = useState(false);

  const [country, setCountry] =
    useState(null);

  const [
    developerMessage,
    setDeveloperMessage,
  ] = useState(false);

  const [loader, setLoader] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    const locales = getLocales();

    setCountry(
      locales?.[0]?.regionCode ||
        "TR"
    );

    const showTimer = setTimeout(() => {
      setDeveloperMessage(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setDeveloperMessage(false);
    }, 12000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const LoginFormSchema =
    Yup.object().shape({
      username: Yup.string()
        .required(
          "Username is required"
        )
        .min(
          6,
          "Username must contain at least 6 characters"
        )
        .matches(
          /^[a-zA-Z0-9._]+$/,
          "Username can only contain letters, numbers, dots and underscores"
        ),

      email: Yup.string()
        .required(
          "Email is required"
        )
        .email(
          "Enter a valid email address"
        ),

      password: Yup.string()
        .required(
          "Password is required"
        )
        .min(
          6,
          "Password must contain at least 6 characters"
        ),
    });

  const getRandomProfilePicture =
    async () => {
      const response = await fetch(
        "https://randomuser.me/api"
      );

      if (!response.ok) {
        throw new Error(
          "Could not load profile picture"
        );
      }

      const data =
        await response.json();

      return (
        data?.results?.[0]
          ?.picture?.large || ""
      );
    };

  const usernameExists =
    async (username) => {
      const normalized =
        username
          .trim()
          .toLowerCase();

      const snapshot =
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

      if (!snapshot.empty) {
        return true;
      }

      // Backward compatibility for
      // users created before usernameLower
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

      return !fallbackSnapshot.empty;
    };

  const emailExists =
    async (email) => {
      const snapshot =
        await getDocs(
          query(
            collection(db, "users"),
            where(
              "email",
              "==",
              email
                .trim()
                .toLowerCase()
            )
          )
        );

      return !snapshot.empty;
    };

  const onSignup = async (
    email,
    username,
    password,
    country
  ) => {
    if (loader) return;

    setErrorMessage("");

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanUsername =
      username.trim();

    try {
      setLoader(true);

      const [
        existingEmail,
        existingUsername,
      ] = await Promise.all([
        emailExists(cleanEmail),
        usernameExists(
          cleanUsername
        ),
      ]);

      if (existingEmail) {
        setErrorMessage(
          "This email address is already in use."
        );
        return;
      }

      if (existingUsername) {
        setErrorMessage(
          "This username is already in use."
        );
        return;
      }

      const userCredentials =
        await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      const profilePicture =
        await getRandomProfilePicture();

      await setDoc(
        doc(
          db,
          "users",
          userCredentials.user.email
        ),
        {
          owner_uid:
            userCredentials.user.uid,

          username:
            cleanUsername,

          usernameLower:
            cleanUsername.toLowerCase(),

          email:
            userCredentials.user.email,

          profile_picture:
            profilePicture,

          name:
            cleanUsername,

          bio: "",
          link: "",

          gender: [
            "Prefer not to say",
            "",
          ],

          followers: [],
          following: [],

          followers_request: [],
          following_request: [],

          isPrivate: false,

          event_notification: 0,
          chat_notification: 0,

          saved_posts: [],
          close_friends: [],
          favorite_users: [],
          muted_users: [],

          createdAt:
            serverTimestamp(),

          country:
            country || "TR",
        }
      );
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      if (
        error?.code ===
        "auth/email-already-in-use"
      ) {
        setErrorMessage(
          "This email address is already in use."
        );
      } else if (
        error?.code ===
        "auth/invalid-email"
      ) {
        setErrorMessage(
          "Please enter a valid email address."
        );
      } else if (
        error?.code ===
        "auth/weak-password"
      ) {
        setErrorMessage(
          "Password is too weak."
        );
      } else {
        setErrorMessage(
          "Registration failed. Please try again."
        );
      }
    } finally {
      setLoader(false);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          email: "",
          username: "",
          password: "",
        }}
        onSubmit={(values) =>
          onSignup(
            values.email,
            values.username,
            values.password,
            country
          )
        }
        validationSchema={
          LoginFormSchema
        }
        validateOnMount
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          isValid,
        }) => (
          <View>
            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    emailToValidate &&
                    !Validator.validate(
                      values.email
                    )
                      ? "#f00"
                      : "#444",
                },
              ]}
            >
              <TextInput
                style={styles.inputText}
                placeholderTextColor="#BBB"
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                onChangeText={(text) => {
                  setErrorMessage("");
                  handleChange(
                    "email"
                  )(text);
                }}
                onBlur={() => {
                  handleBlur("email");
                  setEmailOnFocus(
                    false
                  );
                  setEmailToValidate(
                    values.email.length > 0
                  );
                }}
                onFocus={() =>
                  setEmailOnFocus(true)
                }
                value={values.email}
              />

              <TouchableOpacity
                onPress={() =>
                  handleChange(
                    "email"
                  )("")
                }
              >
                <Octicons
                  name={
                    emailOnFocus
                      ? "x-circle-fill"
                      : ""
                  }
                  size={15}
                  color="#555"
                />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    userToValidate &&
                    values.username.length < 6
                      ? "#f00"
                      : "#444",
                },
              ]}
            >
              <TextInput
                style={styles.inputText}
                placeholderTextColor="#BBB"
                placeholder="Username"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
                onChangeText={(text) => {
                  setErrorMessage("");
                  handleChange(
                    "username"
                  )(text);
                }}
                onBlur={() => {
                  handleBlur(
                    "username"
                  );

                  setUserOnFocus(
                    false
                  );

                  setUserToValidate(
                    values.username
                      .length > 0
                  );
                }}
                onFocus={() =>
                  setUserOnFocus(true)
                }
                value={
                  values.username
                }
              />

              <TouchableOpacity
                onPress={() =>
                  handleChange(
                    "username"
                  )("")
                }
              >
                <Octicons
                  name={
                    userOnFocus
                      ? "x-circle-fill"
                      : ""
                  }
                  size={15}
                  color="#555"
                />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    passwordToValidate &&
                    values.password.length < 6
                      ? "#f00"
                      : "#444",
                },
              ]}
            >
              <TextInput
                style={styles.inputText}
                placeholderTextColor="#bbb"
                placeholder="Password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={
                  obsecureText
                }
                textContentType="password"
                onChangeText={handleChange(
                  "password"
                )}
                onBlur={() => {
                  handleBlur(
                    "password"
                  );

                  setPasswordToValidate(
                    values.password
                      .length > 0
                  );
                }}
                value={
                  values.password
                }
              />

              <TouchableOpacity
                onPress={() =>
                  setObsecureText(
                    (previous) =>
                      !previous
                  )
                }
              >
                <MaterialCommunityIcons
                  name={
                    obsecureText
                      ? "eye-off"
                      : "eye"
                  }
                  size={22}
                  color={
                    obsecureText
                      ? "#fff"
                      : "#37e"
                  }
                />
              </TouchableOpacity>
            </View>

            {!!errorMessage && (
              <Text style={styles.errorText}>
                {errorMessage}
              </Text>
            )}

            <View
              style={
                styles.forgotContainer
              }
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    "Forgot"
                  )
                }
              >
                <Text
                  style={
                    styles.forgotText
                  }
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={
                !isValid || loader
              }
            >
              <View
                style={styles.btnContainer(
                  isValid &&
                    !loader
                )}
              >
                {loader ? (
                  <ActivityIndicator
                    color="#fff"
                  />
                ) : (
                  <Text
                    style={styles.btnText}
                  >
                    Sign up
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <View
              style={{
                height: 56,
              }}
            >
              {developerMessage && (
                <Animated.View
                  style={
                    styles.modalContainer
                  }
                  entering={FadeInDown.duration(
                    1000
                  )}
                  exiting={FadeOutDown.duration(
                    1000
                  )}
                >
                  <Ionicons
                    name="logo-react"
                    size={22}
                    color="#fff"
                  />

                  <Text
                    style={
                      styles.modalText
                    }
                  >
                    Developed by Hernan
                    Hawryluk
                  </Text>
                </Animated.View>
              )}
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default SignupForm;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  inputField: {
    marginTop: 14,
    backgroundColor: "#111",
    borderRadius: 8,
    borderWidth: 1,
    paddingLeft: 15,
    paddingRight: 15,
    marginHorizontal: 20,
    height:
      Platform.OS === "android"
        ? 54
        : 52,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  inputText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
    flex: 1,
    marginRight: 8,
  },

  errorText: {
    color: "#ff4d61",
    fontSize: 13,
    marginHorizontal: 20,
    marginTop: 10,
    lineHeight: 18,
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginTop: 18,
    marginRight: 20,
  },

  forgotText: {
    color: "#1af",
    fontWeight: "700",
  },

  btnContainer: (isValid) => ({
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#07f",
    opacity: isValid ? 1 : 0.55,
    marginHorizontal: 20,
    height:
      Platform.OS === "android"
        ? 54
        : 52,
    borderRadius: 10,
  }),

  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },

  modalContainer: {
    marginTop: 14,
    marginHorizontal: 20,
    backgroundColor: "#333",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    height:
      Platform.OS === "android"
        ? 54
        : 52,
    paddingHorizontal: 18,
    gap: 10,
  },

  modalText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#fff",
  },
});
