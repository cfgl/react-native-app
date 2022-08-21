import React, {Component} from "react";
import {Text, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";

export default class rules extends Component {
  render() {
    return (
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              height: 60,
              color: "#edd798",
              fontFamily: "Monda",
              fontSize: 30,
              fontWeight: "600",
              lineHeight: 35,
              alignSelf: "center",
              marginTop: 50,
            }}>
            How To Play
          </Text>
          <View style={{alignItems: "center"}}>
            <View
              style={{
                width: "90%",
                height: 38,
                backgroundColor: "#edd798",
                justifyContent: "center",
              }}>
              <Text
                style={{
                  color: "#191919",
                  fontFamily: "Arial",
                  fontSize: 14,
                  fontWeight: "700",
                  marginLeft: 20,
                }}>
                QUICK LOOK - WEEKLY PICKS
              </Text>
            </View>
            <View
              style={{
                width: "90%",
                backgroundColor: "#191919",
                padding: 20,
              }}>
              <Text
                style={{
                  color: "#edd798",
                  fontFamily: "Arial",
                  fontSize: 14,
                  fontWeight: "400",
                  lineHeight: 18,
                }}>
                {`Pick 6 games each week:
1 Power Game- 10 points (from your Power Conference, selected during sign-up)
1 Binding Conference Game-10 points (assigned from the weekly schedule)
3 other games- 7 points each (no restrictions)
1 Dog Game (pick an underdog to win straight up, not to cover. Underdogs only.)`}
              </Text>
            </View>
          </View>

          <View style={{alignItems: "center", marginBottom: 20}}>
            <View
              style={{
                width: "90%",
                height: 38,
                marginTop: 40,
                backgroundColor: "#edd798",
                justifyContent: "center",
              }}>
              <Text
                style={{
                  color: "#191919",
                  fontFamily: "Arial",
                  fontSize: 14,
                  fontWeight: "700",
                  marginLeft: 20,
                }}>
                QUICK LOOK – WAYS TO PICK & SCORE
              </Text>
            </View>
            <View
              style={{
                width: "90%",

                backgroundColor: "#191919",
                padding: 20,
              }}>
              <Text
                style={{
                  color: "#edd798",
                  fontFamily: "Arial",
                  fontSize: 14,
                  fontWeight: "400",
                  lineHeight: 18,
                }}>
                {`Perfecto – Win five separate games, double your points. (Dog game excluded)

Stacking – Pick a game more than once.

Parlay – Group games together to win bonus points. Must win all games in parlay.

$Lines – Pick an underdog to win the game, and win the points of the spread.

***ALL PICKS ARE DUE NO LATER THAN KICKOFF OF THE SATURDAY MORNING GAMES.  NO EXCEPTIONS.  THE CFGL IS NOT RESPONSIBLE FOR ANY TECHNICAL ISSUES IN YOU SUBMITTING YOUR PICKS.  PLEASE TAKE A SCREEN-SHOT BEFORE YOU SUBMIT.***`}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
