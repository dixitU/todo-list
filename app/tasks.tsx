import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Size } from "@/utils/Sizes";
import { Colors } from "@/constants/Colors";
import { useMutation } from "@tanstack/react-query";
import { getAllTask } from "@/apis/task";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useConstantContext } from "@/hooks/useConstant";
import { useAppDispatch, useAppSelector } from "@/utils/store";
import { clearAuth } from "@/reducers/authSlice";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useNavigation } from "@react-navigation/native";

const WIDTH = Dimensions.get("window").width;

export default function TasksScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { setInitialRoute } = useConstantContext();
  const [refreshing, setRefreshing] = useState(false);
  const { profile } = useAppSelector((state) => ({
    profile: state.auth.profile,
  }));
  const [data, setData] = useState();
  const { mutate: getAllTaskMutation, isPending } = useMutation({
    mutationFn: () => getAllTask(),
    onSuccess: (d: any) => {
      console.log("getAllTaskData", d);
      setData(d);
    },
  });

  useEffect(() => {
    getAllTaskMutation();
  }, []);

  const textColor = useThemeColor(
    { light: "#3a3c40", dark: "#3a3c40" },
    "text"
  );
  const smalltextColor = useThemeColor(
    { light: "#727376", dark: "#727376" },
    "text"
  );

  const refreshColor = useThemeColor(
    { light: "#151718", dark: "#ffffff" },
    "text"
  );

  const refreshReverseColor = useThemeColor(
    { dark: "#151718", light: "#ffffff" },
    "text"
  );

  const onRefresh = () => {
    setRefreshing(true);
    getAllTaskMutation();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const TaskCard = ({ item, index }: any) => {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => {
          navigation.navigate("TaskDetail", { id: item._id });
        }}
      >
        <ThemedText
          type="defaultSemiBold"
          style={{ color: textColor }}
          numberOfLines={1}
        >
          {item.title}
        </ThemedText>
        <ThemedText
          type="small"
          style={{ color: smalltextColor }}
          numberOfLines={3}
        >
          {item.description}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item, index }: any) => {
    return <TaskCard item={item} index={index} />;
  };

  return (
    <>
      <ThemedView style={styles.container}>
        <ThemedView
          style={[styles.rowSpaceContainer, { paddingHorizontal: 14 }]}
        >
          <ThemedText
            type="titleMedium"
            numberOfLines={1}
          >{`Hi, ${profile.name}`}</ThemedText>
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.clear();
              dispatch(clearAuth());
              setInitialRoute("Signup");
            }}
          >
            <Image
              source={require("../assets/app/logout.png")}
              style={[
                styles.logoImage,
                {
                  tintColor: Colors.primary,
                },
              ]}
            />
          </TouchableOpacity>
        </ThemedView>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item: any) => item._id}
          ListEmptyComponent={
            isPending ? (
              <ThemedView>
                <ActivityIndicator size={30} color={refreshColor} />
              </ThemedView>
            ) : (
              <ThemedView>
                <ThemedText type="default">No Task Availble</ThemedText>
              </ThemedView>
            )
          }
          contentContainerStyle={[
            styles.centerContainer,
            { justifyContent: data?.length > 0 ? "flex-start" : "center" },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[refreshColor]}
              progressBackgroundColor={refreshReverseColor}
            />
          }
        />
        <TouchableOpacity
          style={styles.plusContainer}
          onPress={() => {
            navigation.navigate("TaskDetail");
          }}
        >
          <Image
            source={require("../assets/app/plus.png")}
            style={[
              styles.plusImage,
              {
                tintColor: Colors.primary,
              },
            ]}
          />
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    // justifyContent: "flex-end",
    paddingTop: StatusBar.currentHeight + 10,
  },
  centerContainer: {
    flexGrow: 1,
    width: WIDTH,
    alignItems: "center",
    paddingHorizontal: 14,
    paddingBottom: StatusBar.currentHeight + 24,
  },
  logoImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  plusImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  rowSpaceContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Size._10,
  },
  cardContainer: {
    width: WIDTH - 28,
    backgroundColor: "#c9cfe2",
    marginTop: Size._10,
    paddingHorizontal: Size._14,
    paddingVertical: Size._10,
    borderRadius: Size.FindSize(5),
  },
  plusContainer: {
    position: "absolute",
    bottom: 10,
    right: 14,
  },
});
