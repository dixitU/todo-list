import React, { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Size } from "@/utils/Sizes";
import { Colors } from "@/constants/Colors";
import { useMutation } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  getAllTask,
  getTaskByID,
  updateTask,
} from "@/apis/task";
import { useThemeColor } from "@/hooks/useThemeColor";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import LottieView from "lottie-react-native";

export default function TaskDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const id = route.params?.id;
  const [type, setType] = useState("normal");
  const [isEditable, setIsEditable] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const iconColor = useThemeColor(
    { light: "#151718", dark: "#ffffff" },
    "text"
  );

  const { mutate: getTaskByIDMutation, isPending } = useMutation({
    mutationFn: (i: any) => getTaskByID(i),
    onSuccess: (data: any) => {
      console.log("getTaskByIDMutation", data);
      setTitle(data.title);
      setDescription(data.description);
    },
  });

  const { mutate: createTaskMutation } = useMutation({
    mutationFn: (options: any) => createTask(options),
    onSuccess: (data: any) => {
      setType("success");
      setTimeout(() => {
        // setType("normal");
        navigation.goBack();
      }, 2000);
    },
  });

  const { mutate: deleteTaskMutation } = useMutation({
    mutationFn: (i: any) => deleteTask(i),
    onSuccess: (data: any) => {
      setType("success");
      setTimeout(() => {
        // setType("normal");
        navigation.goBack();
      }, 2000);
    },
  });

  const { mutate: updateTaskMutation } = useMutation({
    mutationFn: ({ i, options }: any) => updateTask(i, options),
    onSuccess: (data: any) => {
      setType("success");
      setTimeout(() => {
        setIsEditable(false);
        setType("normal");
        // navigation.goBack();
      }, 2000);
    },
  });

  useEffect(() => {
    if (id) {
      getTaskByIDMutation(id);
    }
  }, [id]);

  const onTaskCreate = () => {
    createTaskMutation({
      title: title,
      description: description,
    });
  };

  const onTaskSave = () => {
    updateTaskMutation({
      i: id,
      options: {
        title: title,
        description: description,
      },
    });
  };

  const onDelete = () => {
    deleteTaskMutation(id);
  };

  const Header = () => {
    return (
      <ThemedView style={styles.headerContainer}>
        <ThemedView style={styles.rowContainer}>
          <TouchableOpacity
            onPress={async () => {
              navigation.goBack();
            }}
          >
            <Image
              source={require("../assets/app/back.png")}
              style={[
                styles.headerImage,
                {
                  tintColor: iconColor,
                  marginRight: Size._10,
                },
              ]}
            />
          </TouchableOpacity>
          <ThemedText type="default">
            {id ? "Task Detail" : "Create New Task"}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.rowContainer}>
          {id && !isEditable ? (
            <TouchableOpacity onPress={() => setIsEditable(true)}>
              <Image
                source={require("../assets/app/edit.png")}
                style={[
                  styles.headerImage,
                  {
                    tintColor: iconColor,
                    marginRight: Size._20,
                  },
                ]}
              />
            </TouchableOpacity>
          ) : null}
          {id && !isEditable ? (
            <TouchableOpacity onPress={onDelete}>
              <Image
                source={require("../assets/app/delete.png")}
                style={[
                  styles.headerImage,
                  {
                    tintColor: iconColor,
                  },
                ]}
              />
            </TouchableOpacity>
          ) : null}
        </ThemedView>
      </ThemedView>
    );
  };

  return (
    <>
      {type !== "success" ? (
        <ThemedView style={styles.container}>
          <Header />
          {isPending ? (
            <ThemedView style={styles.activityContainer}>
              <ActivityIndicator size={30} color={iconColor} />
            </ThemedView>
          ) : (
            <ParallaxScrollView>
              {id && !isEditable ? (
                <ThemedText type="title" style={{ marginBottom: Size._20 }}>
                  {title}
                </ThemedText>
              ) : (
                <TextInput
                  label="Title"
                  mode="outlined"
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                  style={{ backgroundColor: "transparent" }}
                  activeOutlineColor={iconColor}
                />
              )}
              {id && !isEditable ? (
                <ThemedText type="default" style={{ marginBottom: Size._10 }}>
                  {description}
                </ThemedText>
              ) : (
                <TextInput
                  label="Description"
                  mode="outlined"
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                  multiline={true}
                  style={{
                    backgroundColor: "transparent",
                    height: 300,
                    textAlignVertical: "top",
                  }}
                  activeOutlineColor={iconColor}
                />
              )}
            </ParallaxScrollView>
          )}
          {isEditable || !id ? (
            <ThemedView style={styles.linkContainer}>
              <TouchableOpacity
                style={[styles.link, {opacity: title.trim() === '' || description.trim() === '' ? 0.5 : 1}]}
                disabled={title.trim() === '' || description.trim() === ''}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (id) {
                    onTaskSave();
                  } else {
                    onTaskCreate();
                  }
                }}
              >
                <ThemedText type="defaultSemiBold" style={styles.linkText}>
                  {id ? "Save" : "Create"}
                </ThemedText>
              </TouchableOpacity>
              {id ? (
                <TouchableOpacity
                  style={{ marginTop: Size._15 }}
                  onPress={() => setIsEditable(false)}
                >
                  <ThemedText type="default" style={styles.linkText}>
                    {"Cancel"}
                  </ThemedText>
                </TouchableOpacity>
              ) : null}
            </ThemedView>
          ) : null}
        </ThemedView>
      ) : (
        <ThemedView style={styles.centerContainer}>
          <LottieView
            autoPlay
            style={styles.lottie}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("../assets/lottie/success.json")}
            onAnimationFinish={() => {
              setType("normal");
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
    // justifyContent: "flex-end",
    padding: 14,
    paddingTop: StatusBar.currentHeight + 10,
  },
  activityContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    width: "100%",
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Size._40,
    justifyContent: "space-between",
  },
  headerImage: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowSpaceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  link: {
    // marginTop: 15,
    paddingVertical: Size._15,
    backgroundColor: Colors.primary,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Size._40,
  },
  linkContainer: {
    width: "100%",
    position: "absolute",
    bottom: 10,
    paddingTop: 10,
  },
  linkText: { textAlign: "center", color: "#FFFFFF" },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  lottie: {
    width: 200,
    height: 200,
  },
});
