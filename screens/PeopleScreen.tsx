import { CometChat } from "@cometchat-pro/react-native-chat";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState } from "react";
import AddFriendsScreen from "./AddFriendsScreen";
import FriendsScreen from "./FriendsScreen";

const SEARCH_LIMIT = 30;

const Tab = createMaterialTopTabNavigator();

type PeopleScreenProps = {
  user: CometChat.User;
};

const PeopleScreen = ({ user }: PeopleScreenProps) => {
  const [allUsersList, setAllUsersList] = useState<CometChat.User[]>();
  const [friendsList, setFriendsList] = useState<CometChat.User[]>();
  const [nonFriendsList, setNonFriendsList] = useState<CometChat.User[]>();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const forceUpdate = () => {
    fetchAllUsers();
  };

  useEffect(() => {
    fetchFriendsList();
  }, [allUsersList]);

  useEffect(() => {
    if (friendsList !== undefined && allUsersList !== undefined) {
      const nonFriends = allUsersList.filter((el) => {
        return !friendsList.find((friend) => friend.getUid() === el.getUid());
      });
      setNonFriendsList(nonFriends);
    }
  }, [friendsList]);

  const fetchAllUsers = () => {
    const allUsersRequest = new CometChat.UsersRequestBuilder()
      .setLimit(SEARCH_LIMIT)
      .build();

    allUsersRequest.fetchNext().then(
      (userList) => {
        /* userList will be the list of User class. */
        // console.log("User list received:", userList);
        /* retrived list can be used to display contact list. */
        setAllUsersList(userList);
      },
      (error) => {
        console.log("User list fetching failed with error:", error);
      }
    );
  };

  const fetchFriendsList = () => {
    const friendsListRequest = new CometChat.UsersRequestBuilder()
      .setLimit(SEARCH_LIMIT)
      .friendsOnly(true)
      .build();

    friendsListRequest.fetchNext().then(
      (userList) => {
        /* userList will be the list of User class. */
        // console.log("User list received:", userList);
        /* retrived list can be used to display contact list. */
        setFriendsList(userList);
      },
      (error) => {
        console.log("User list fetching failed with error:", error);
      }
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === "Friends") {
            iconName = focused ? "people-circle" : "people-circle-outline";
          } else if (route.name === "AddFriends") {
            iconName = focused ? "person-add" : "person-add-outline";
          }

          return <Ionicons name={iconName} color={color} size={20} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#85089e",
        inactiveTintColor: "#3d3d3b",
        style: { backgroundColor: "black" },
        showIcon: true,
        labelStyle: {
          fontSize: 12,
          fontFamily: "serif",
          textTransform: "capitalize",
        },
        indicatorStyle: { backgroundColor: "#85089e" },
        tabStyle: {
          flexDirection: "row",
        },
      }}
    >
      <Tab.Screen name="Friends" options={{ tabBarLabel: "Friends" }}>
        {(props) => (
          <FriendsScreen
            {...props}
            user={user}
            friendsList={friendsList}
            forceUpdate={forceUpdate}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="AddFriends" options={{ tabBarLabel: "Add Friends" }}>
        {(props) => (
          <AddFriendsScreen
            {...props}
            user={user}
            nonFriendsList={nonFriendsList}
            forceUpdate={forceUpdate}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default PeopleScreen;
