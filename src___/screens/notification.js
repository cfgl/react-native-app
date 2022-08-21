import React, { Component } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import ActionSheet from "react-native-actionsheet";
import { jaune, noir, gris } from "../styles/colors";
import { Ionicons } from "react-native-vector-icons";
import { connect } from "react-redux";
import { Switch } from "react-native-paper";

import {
  setCurrentWeek,
  getCurrentWeekGame,
  getMyGroupBets,
  getBets,
} from "../redux/actions/game";

import { setBowlSeason, setNotification } from "../redux/actions/user";
const weekList = [
  "Week 1",
  "Week 2",
  "Week 3",
  "Week 4",
  "Week 5",
  "Week 6",
  "Week 7",
  "Week 8",
  "Week 9",
  "Week 10",
  "Week 11",
  "Week 12",
  "Week 13",
  "Week 14",
  "Week 15",
  "Cancel",
];
class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      week: "Week " + this.props.currentWeek,
      isSwitchOnNot: this.props.enableNotification ? this.props.enableNotification : false,
      isSwitchOnDrak: false,
      isBowlSeason: this.props.bowlSeason,
    };
  }

  showWeek = () => {
    this.ActionSheet.show();
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentWeek !== this.props.currentWeek) {
      this.props.getCurrentWeekGame(
        this.props.currentYear,
        this.props.currentWeek
      );
      this.props.getMyGroupBets(this.props.user.group._id, this.props.token);
      // this.props.getBets(this.props.user.group._id, this.props.token);
    }
  }

  render() {
    return (
      <View>
        <View style={{ padding: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",

                marginVertical: 15,
              }}>
              <Text style={{ color: jaune, fontSize: 15 }}>
                {"Notifications"}
              </Text>
              <Switch
                value={this.state.isSwitchOnNot}
                color={jaune}
                style={{}}
                onValueChange={() => {
                  this.setState(
                    { isSwitchOnNot: !this.state.isSwitchOnNot },
                    () => {
                      this.props.setNotification(this.state.isSwitchOnNot)
                    }
                  );
                }}
              />
            </View>

            {/* <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",

                marginVertical: 15,
              }}>
              <Text style={{color: jaune, fontSize: 15}}>
                {"Activate Bowl season  (only for test)"}
              </Text>
              <Switch
                value={this.state.isBowlSeason}
                color={jaune}
                style={{}}
                onValueChange={() => {
                  this.setState(
                    {isBowlSeason: !this.state.isBowlSeason},
                    () => {
                      this.props.setBowlSeason(this.state.isBowlSeason);
                    }
                  );
                }}
              />
            </View>

            <TouchableOpacity
              onPress={this.showWeek}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                height: 50,
                width: "100%",
                backgroundColor: noir,
                alignItems: "center",
                paddingHorizontal: 20,
              }}>
              <Text style={{color: jaune, fontSize: 12, fontWeight: "400"}}>
                {this.state.week + " (only for test)"}
              </Text>
              <Ionicons name={"ios-arrow-down"} color={jaune} size={20} />
            </TouchableOpacity>
             */}

            <ActionSheet
              ref={(o) => (this.ActionSheet = o)}
              title={"Select the week"}
              options={weekList}
              cancelButtonIndex={15}
              // destructiveButtonIndex={1}
              onPress={(index) => {
                if (index !== 15)
                  this.setState({ week: weekList[index] }, () => {
                    this.props.setCurrentWeek(index + 1);

                    alert("Please restart the application to be effective.");
                  });
              }}
            />
          </ScrollView>
        </View>
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  const { user, token, bowlSeason, enableNotification } = state.user;
  const { currentWeek, currentYear } = state.game;
  return {
    user,
    token,
    currentWeek,
    currentYear,
    enableNotification
  };
};
export default connect(mapStateToProps, {
  setCurrentWeek,
  getCurrentWeekGame,
  getMyGroupBets,
  getBets,
  setBowlSeason,
  setNotification,
})(Notification);
