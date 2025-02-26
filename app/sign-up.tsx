import React, { useRef, useState } from "react";
import { Link } from "expo-router";
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Haptics from "expo-haptics";
import LottieView from "lottie-react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Size } from "@/utils/Sizes";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { useMutation } from "@tanstack/react-query";
import { getAllTask } from "@/apis/task";
import { login, signup } from "@/apis/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useConstantContext } from "@/hooks/useConstant";
import { setAuth } from "@/reducers/authSlice";
import { useAppDispatch } from "@/utils/store";
import { TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const EMAIL_ERROR = "Please Enter Valid Email";
const PASSWORD_ERROR = "Password must be 8 digit";

export default function SignUpScreen() {
  const dispatch = useAppDispatch();
  const { setInitialRoute } = useConstantContext();
  const [type, setType] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [validate, setValidate] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const animation = useRef<LottieView>(null);

  // Call useThemeColor **before** returning JSX
  const borderColor = useThemeColor({ light: "#ccc", dark: "#585858" }, "text");
  const textColor = useThemeColor(
    { light: "#151718", dark: "#ffffff" },
    "text"
  );
  const placeholderColor = useThemeColor(
    { light: "#ccc", dark: "#585858" },
    "text"
  );

  const { mutate: loginMutation, isPending: isLoginLoading } = useMutation({
    mutationFn: (options: any) => login(options.email, options.password),
    onSuccess: async (resData: any) => {
      console.log("login Data", resData);
      if (resData.message === "User verified") {
        const { token } = resData;
        await AsyncStorage.setItem("accessToken", token.accessToken);
        await AsyncStorage.setItem("refreshToken", token.refreshToken);
        dispatch(setAuth(resData));
        setType("success");
        setTimeout(() => {
          setInitialRoute("Tasks");
        }, 2000);
      } else {
        Alert.alert("Validation", resData.message);
      }
    },
  });

  const { mutate: signupMutation, isPending: isSignupLoading } = useMutation({
    mutationFn: (options: any) => signup(options),
    onSuccess: async (resData: any) => {
      if (resData.message === "User created") {
        setType("success");
        setTimeout(() => {
          setType("login");
        }, 2000);
      } else {
        Alert.alert("Validation", resData.message);
      }
    },
  });

  const onLogin = async () => {
    console.log("onLogin", { email, password });
    loginMutation({ email, password });
  };

  const onSignUp = async () => {
    console.log("onLogin", { name, email, password });
    signupMutation({ name, email, password });
  };

  const validateEmail = (text: any) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (text.trim() !== "" && reg.test(text) === false) {
      setEmail(text);
      setValidate(EMAIL_ERROR);
    } else {
      setEmail(text);
      setValidate("");
    }
  };

  const validatePassword = (text: any) => {
    if (text.trim() !== "" && text.length < 8) {
      setPassword(text);
      setValidate(PASSWORD_ERROR);
    } else {
      setPassword(text);
      setValidate("");
    }
  };

  const check = () => {
    return (
      email === "" ||
      validate === EMAIL_ERROR ||
      validate === PASSWORD_ERROR ||
      password === ""
    );
  };

  return (
    <>
      {type !== "success" ? (
        <ThemedView style={styles.container}>
          <ThemedView style={styles.imageContainer}>
            <Image
              source={require("../assets/app/app-icon.png")}
              style={[
                styles.logoImage,
                {
                  tintColor: Colors.primary,
                },
              ]}
            />
          </ThemedView>
          <ThemedText type="title" style={{ marginBottom: Size._40 }}>
            {type === "signup" ? "Create an account" : "Login"}
          </ThemedText>
          {type === "signup" ? (
            <TextInput
              mode="outlined"
              style={[
                styles.input,
                {
                  color: textColor,
                },
              ]}
              placeholder="Name"
              label="Name"
              placeholderTextColor={placeholderColor}
              value={name}
              onChangeText={setName}
              activeOutlineColor={textColor}
            />
          ) : null}
          <TextInput
            mode="outlined"
            style={[
              styles.input,
              {
                color: textColor,
              },
            ]}
            placeholder="Email"
            label="Email"
            placeholderTextColor={placeholderColor}
            value={email}
            onChangeText={(text: any) => validateEmail(text)}
            activeOutlineColor={
              validate === EMAIL_ERROR ? "#ff4343" : textColor
            }
          />
          {validate === EMAIL_ERROR ? (
            <ThemedText type="small" style={styles.errorText}>
              {EMAIL_ERROR}
            </ThemedText>
          ) : null}
          <TextInput
            mode="outlined"
            style={[
              styles.input,
              {
                color: textColor,
              },
            ]}
            placeholder="Password"
            label="Password"
            placeholderTextColor={placeholderColor}
            value={password}
            onChangeText={(text: any) => validatePassword(text)}
            secureTextEntry={isPasswordSecure}
            activeOutlineColor={
              validate === PASSWORD_ERROR ? "#ff4343" : textColor
            }
            right={
              <TextInput.Icon
                icon={() => (
                  <MaterialCommunityIcons
                    name={isPasswordSecure ? "eye-off" : "eye"}
                    size={28}
                    color={textColor}
                  />
                )} // where <Icon /> is any component from vector-icons or anything else
                onPress={() => {
                  isPasswordSecure
                    ? setIsPasswordSecure(false)
                    : setIsPasswordSecure(true);
                }}
              />
            }
          />
          {validate === PASSWORD_ERROR ? (
            <ThemedText type="small" style={styles.errorText}>
              {PASSWORD_ERROR}
            </ThemedText>
          ) : null}
          <TouchableOpacity
            style={[styles.link, { opacity: check() ? 0.5 : 1 }]}
            disabled={check()}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (type === "login") {
                onLogin();
              } else {
                onSignUp();
              }
            }}
          >
            <ThemedText type="defaultSemiBold" style={styles.linkText}>
              {type === "signup" ? "Sign up" : "Login"}
            </ThemedText>
            {isLoginLoading || isSignupLoading ? (
              <ActivityIndicator
                style={{ marginLeft: Size._10 }}
                color={"#ffffff"}
                size={20}
              />
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginTop: Size._15 }}
            onPress={() => {
              if (type === "signup") {
                setType("login");
              } else {
                setType("signup");
              }
            }}
          >
            <ThemedText type="default" style={styles.linkText}>
              {type === "signup" ? "back to login" : "want create an account?"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <ThemedView style={styles.centerContainer}>
          <LottieView
            autoPlay
            ref={animation}
            style={styles.lottie}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("../assets/lottie/success.json")}
            onAnimationFinish={() => {
              setInitialRoute("Tasks");
            }}
          />
        </ThemedView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: Size._15,
    backgroundColor: Colors.primary,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Size._40,
  },
  linkText: { textAlign: "center", color: "#FFFFFF" },
  input: {
    width: "100%",
    height: 50,
    borderRadius: Size._10,
    marginVertical: Size._15,
  },
  logoImage: {
    width: Size.FindSize(100),
    height: Size.FindSize(100),
    resizeMode: "contain",
    marginBottom: Size._50,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  errorText: {
    color: "#ff4343",
    textAlign: "left",
    width: "100%",
  },
});
