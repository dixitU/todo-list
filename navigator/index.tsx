import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TasksScreen from "../app/tasks";
import TaskDetailScreen from "../app/task-detail";
import SignUpScreen from "@/app/sign-up";
import { useConstantContext } from "@/hooks/useConstant";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppStackNavigator = createStackNavigator<any>();

export default function Navigator() {
  const { initialRoute, setInitialRoute } = useConstantContext();

  useEffect(() => {
    loadInitialRoute();
  }, []);

  const loadInitialRoute = async () => {
    const value = await AsyncStorage.getItem("accessToken");
    if (value) {
      setInitialRoute("Tasks");
    } else {
      setInitialRoute("Signup");
    }
  };

  if (initialRoute === "Signup") {
    return <SignUpScreen />;
  }
  if (initialRoute === "Tasks") {
    return (
      <AppStackNavigator.Navigator initialRouteName={"Tasks"}>
        <AppStackNavigator.Screen
          name="Tasks"
          component={TasksScreen}
          options={{ headerShown: false }}
        />
        <AppStackNavigator.Screen
          name="TaskDetail"
          component={TaskDetailScreen}
          options={{ headerShown: false }}
        />
      </AppStackNavigator.Navigator>
    );
  }
  return null;
}
