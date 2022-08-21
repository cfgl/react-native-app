import React, { Component } from "react";
import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import {
  getHerBets,
  getHerParlays,
  getHerGroupUsers,
  getHerGroupBets,
  getGroupParlays,
} from "../redux/actions/otherUser";
import { Ionicons } from "react-native-vector-icons";

import {
  betsGroupByWeek,
} from "../utils/functions";

import { jaune } from "../styles/colors";
import { gameString } from '../utils/functions'
class profileTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pts: 0,
      bets: [],
      nbParlay: 0,
      allBetsByWeek: [],
      stats: {
        powerGameWin: 0,
        bindingGameWin: 0,
        freeGameWin: 0,
        dogGameWin: 0,
        rankDivision: 0,
        chipsWin: 0,
        parlays: 0,
        stacks: 0,
      },
      allBetsByWeek: [],
      group: this.props.herInfoUser.group ? this.props.groups.filter(i => i.id === this.props.herInfoUser.group || i.id === this.props.herInfoUser.group.id)[0] : null,
      conference: this.props.herInfoUser.conference ? this.props.conferences.filter(i => i.id === this.props.herInfoUser.conference || i.id === this.props.herInfoUser.conference.id)[0] : null
    };
    console.log("==============================================");
    //console.log(JSON.stringify(this.props.groups, null, 2));
    this.props.getHerParlays(this.props.herInfoUser._id, this.props.token);
    // this.props.getHerBets(this.props.herInfoUser._id, this.props.token);
    // this.props.getHerGroupUsers(
    //   this.props.herInfoUser.group._id,
    //   this.props.token
    // ),
    //   this.props.token;
    // this.props.getHerGroupBets(
    //   this.props.herInfoUser.group._id,
    //   this.props.token
    // );
    // this.props.getGroupParlays(
    //   this.props.herInfoUser.group._id,
    //   this.props.token
    // );
  }
  componentDidMount() {
    if (this.props.players && this.props.players.length > 0) {
      let pnts = this.props.players.filter(
        (a) => a.user._id === this.props.herInfoUser._id
      );

      if (pnts && pnts.length > 0) {
        let weekGroup = betsGroupByWeek(pnts[0].results);

        let tab = [];
        weekGroup.map((w) => {
          let count = w.games.filter(
            (a) => a.canParlay === true && a.win === true
          ).length;
          let isParlayThisWeek = pnts[0].parlays.filter((f) => f.week == w.week)
            .length;
          console.log(isParlayThisWeek);

          tab.push({
            week: w.week,
            parlay: count === 3 && isParlayThisWeek === 1,
          });
        });

        //console.log(JSON.stringify(tab, null, 2));

        let rankingList = _.orderBy(this.props.players, ["total"], ["desc"]);
        let userRanker = _.findIndex(
          rankingList,
          (o) => o.user._id === this.props.herInfoUser._id
        );

        let topPlayerGames = rankingList.filter(
          (i) => i.user._id == this.props.herInfoUser._id
        )[0].results;

        if (this.props.herInfoUser._id) {
          this.setState({
            allBetsByWeek: pnts[0].results,
            pts: pnts.length > 0 ? pnts[0].total : 0,
            bets: topPlayerGames,
            stats: {
              powerGameWin:
                topPlayerGames.filter((a) => a.betType.value === "power game")
                  .length > 0
                  ? (topPlayerGames.filter(
                    (a) => a.win && a.betType.value === "power game"
                  ).length /
                    topPlayerGames.filter(
                      (a) => a.betType.value === "power game"
                    ).length) *
                  100
                  : 0,
              bindingGameWin:
                topPlayerGames.filter((a) => a.betType.value === "binding game")
                  .length > 0
                  ? (topPlayerGames.filter(
                    (a) => a.win && a.betType.value === "binding game"
                  ).length /
                    topPlayerGames.filter(
                      (a) => a.betType.value === "binding game"
                    ).length) *
                  100
                  : 0,
              freeGameWin:
                topPlayerGames.filter((a) => a.betType.value.includes("pick"))
                  .length > 0
                  ? (topPlayerGames.filter(
                    (a) => a.win && a.betType.value.includes("pick")
                  ).length /
                    topPlayerGames.filter((a) =>
                      a.betType.value.includes("pick")
                    ).length) *
                  100
                  : 0,
              dogGameWin:
                topPlayerGames.filter((a) => a.betType.value === "dog game")
                  .length > 0
                  ? (topPlayerGames.filter(
                    (a) => a.win && a.betType.value === "dog game"
                  ).length /
                    topPlayerGames.filter(
                      (a) => a.betType.value === "dog game"
                    ).length) *
                  100
                  : 0,
              rankDivision: userRanker + 1,
              chipsWin: 0,
              parlays: tab.filter((a) => a.parlay === true).length,
              stacks: 0,
            },
          });
        }
      }
    }
  }
  componentDidUpdate(prevProps, prevState) {
    // if (prevProps.herBets !== this.props.herBets) {
    //   let topPlayerGames = points(
    //     this.props.herBets,
    //     this.props.herInfoUser._id
    //   );
    //   // console.log(JSON.stringify(topPlayerGames, null, 2));
    //   let ranking = this.props.herGroupUsers
    //     .filter((i) => {
    //       if (
    //         points(this.props.herGroupBets, i._id).reduce(
    //           (a, b) => a + b.points,
    //           0
    //         ) >= 0
    //       ) {
    //         i.total =
    //           points(this.props.herGroupBets, i._id).reduce(
    //             (a, b) => a + b.points,
    //             0
    //           ) +
    //           parleyPoints(
    //             this.props.herGroupBets,
    //             i._id,
    //             this.props.herGroupParlays.filter((p) => p.user._id === i._id)
    //           ) +
    //           perfectoPoints(this.props.herGroupBets, i._id);
    //         return i;
    //       }
    //     })
    //     .sort((a, b) => b.total > a.total);
    //   let power_game =
    //     (topPlayerGames.filter((a) => a.win && a.betType.value === "power game")
    //       .length /
    //       topPlayerGames.filter((a) => a.betType.value === "power game")
    //         .length) *
    //     100;
    //   let binding_game =
    //     (topPlayerGames.filter(
    //       (a) => a.win && a.betType.value === "binding game"
    //     ).length /
    //       topPlayerGames.filter((a) => a.betType.value === "binding game")
    //         .length) *
    //     100;
    //   let pick =
    //     (topPlayerGames.filter((a) => a.win && a.betType.value.includes("pick"))
    //       .length /
    //       topPlayerGames.filter((a) => a.betType.value.includes("pick"))
    //         .length) *
    //     100;
    //   let dog_game =
    //     (topPlayerGames.filter((a) => a.win && a.betType.value === "dog game")
    //       .length /
    //       topPlayerGames.filter((a) => a.betType.value === "dog game").length) *
    //     100;
    //   this.setState({
    //     stats: {
    //       powerGameWin: power_game ? power_game.toFixed(2) : 0,
    //       bindingGameWin: binding_game ? binding_game.toFixed(2) : 0,
    //       freeGameWin: pick ? pick.toFixed(2) : 0,
    //       dogGameWin: dog_game ? dog_game.toFixed(2) : 0,
    //       rankDivision:
    //         _.findIndex(ranking, (o) => o._id == this.props.herInfoUser._id) +
    //         1,
    //       chipsWin: 0,
    //       parlays: 0,
    //       stacks: 0,
    //     },
    //   });
    // }
  }

  render() {
    return (
      <ScrollView style={{}}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 30,
            paddingHorizontal: 10,
            alignSelf: "center"
          }}>
          <TouchableOpacity
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              borderColor: "#edd798",
              borderStyle: "solid",
              borderWidth: 2,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Image
              source={
                this.props.herInfoUser.avatar &&
                  this.props.herInfoUser.avatar.url
                  ? { uri: this.props.herInfoUser.avatar.url }
                  : {
                    uri:
                      "https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg",
                  }
              }
              style={{
                width: 64,
                height: 64,
                borderRadius: 342,
              }}
            />
          </TouchableOpacity>

          <View style={{ flex: 2, marginLeft: 10 }}>
            <Text
              style={{
                color: "#edd798",
                //fontFamily: "Monda",
                fontSize: 20,
                fontWeight: "700",
              }}>
              {this.props.herInfoUser
                ? this.props.herInfoUser.username
                : "MY NAME"}
            </Text>
            <Text
              style={{
                color: "#edd798",
                fontFamily: "Arial",
                fontSize: 12,
                fontWeight: "400",
              }}>
              {this.props.herInfoUser ? this.props.herInfoUser.city : ""}
              {", "}
              {this.props.herInfoUser ? this.props.herInfoUser.state : ""}
            </Text>
            <View
              style={{
                width: "90%",
                height: 1,
                backgroundColor: "#edd798",
                marginVertical: 10,
              }}
            />
            <Text
              style={{
                color: "#edd798",
                fontFamily: "Arial",
                fontSize: 13,
                fontWeight: "400",
              }}>
              {
                this.state.group &&
                  this.state.group.name
                  ? this.state.group.name
                  : ""}
            </Text>
          </View>
          <View style={{ flex: 2, marginRight: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  width: 55,
                  backgroundColor: "#191919",
                  color: "#edd798",
                  fontFamily: "Monda",
                  fontSize: 12,
                  fontWeight: "700",
                  lineHeight: 22,
                  padding: 10,
                }}>
                #{this.state.stats.rankDivision}
              </Text>
              <Text
                style={{
                  width: 80,
                  marginLeft: 5,
                  backgroundColor: "#191919",
                  color: "#edd798",
                  fontFamily: "Monda",
                  fontSize: 12,
                  fontWeight: "700",
                  lineHeight: 22,
                  padding: 10,
                }}>
                {this.state.pts}
                {" pts"}
              </Text>
            </View>
            <Text
              style={{
                width: 140,
                marginTop: 5,
                backgroundColor: "#191919",
                color: "#edd798",
                fontSize: 12,
                fontWeight: "700",
                lineHeight: 22,
                padding: 10,
                textAlign: "center",
              }}>
              Power |{" "}
              {
                this.state.conference &&
                  this.state.conference.conferenceName
                  ? this.state.conference.conferenceName.substring(
                    0,
                    10
                  )
                  : ""}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: 2,
            backgroundColor: "#edd798",
          }}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>

          {this.state.bets.filter(f => f.week === `${this.props.currentWeek}`).map((item, index) => (
            <View
              key={index}
              style={{
                height: 76,
                justifyContent: "center",
                paddingHorizontal: 10,
                borderRightWidth: 1,
                borderRightColor: jaune,
              }}>
              <View
                style={{
                  flexDirection: "row",
                }}>
                <Text
                  style={{
                    color: "#edd798",
                    fontFamily: "Arial",
                    fontSize: 12,
                    fontWeight: "700",
                    lineHeight: 22,
                  }}>
                  {gameString(item.game.GameFull)}
                </Text>
                <View
                  style={{
                    height: 20,
                    borderWidth: 0.5,
                    borderColor: jaune,
                    marginHorizontal: 7,
                  }}></View>
                <Text
                  style={{
                    color: "#edd798",
                    fontFamily: "Arial",
                    fontSize: 12,
                    fontWeight: "700",
                    lineHeight: 22,
                  }}>
                  {item.betMethod.value.toUpperCase()}
                </Text>

                {item.win ? (
                  <View
                    style={{
                      marginTop: -2,
                      marginLeft: 20,
                      marginRight: 10,
                    }}>
                    <Ionicons
                      style={{}}
                      name="ios-checkbox-outline"
                      size={24}
                      color={jaune}
                    />
                  </View>
                ) : (
                    <View
                      style={{
                        width: 17,
                        height: 17,
                        borderColor: "#edd798",
                        borderStyle: "solid",
                        borderWidth: 1.2,
                        borderRadius: 2,
                        marginTop: 2,
                        marginLeft: 20,
                        marginRight: 10,
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                      <Ionicons
                        style={{}}
                        name="ios-close"
                        size={15}
                        color={jaune}
                      />
                    </View>
                  )}
              </View>
            </View>
          ))}
        </ScrollView>
        <View
          style={{
            width: "100%",
            height: 2,
            backgroundColor: "#edd798",
          }}
        />
        <View style={{ flexDirection: "row", backgroundColor: "#191919" }}>
          <Text
            style={{
              flex: 1,
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 14,
              fontWeight: "600",
              padding: 10,
            }}>
            Power Game %
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: "right",
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 12,
              fontWeight: "400",
              padding: 10,
            }}>
            {this.state.stats.powerGameWin.toFixed(1)}%
          </Text>
        </View>
        <View style={{ flexDirection: "row", backgroundColor: "#282828" }}>
          <Text
            style={{
              flex: 1,
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 14,
              fontWeight: "600",
              padding: 10,
            }}>
            Binding Game %
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: "right",
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 12,
              fontWeight: "400",
              padding: 10,
            }}>
            {this.state.stats.bindingGameWin.toFixed(1)}%
          </Text>
        </View>
        <View style={{ flexDirection: "row", backgroundColor: "#191919" }}>
          <Text
            style={{
              flex: 1,
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 14,
              fontWeight: "600",
              padding: 10,
            }}>
            Free Pick %
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: "right",
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 12,
              fontWeight: "400",
              padding: 10,
            }}>
            {this.state.stats.freeGameWin.toFixed(1)}%
          </Text>
        </View>
        <View style={{ flexDirection: "row", backgroundColor: "#282828" }}>
          <Text
            style={{
              flex: 1,
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 14,
              fontWeight: "600",
              padding: 10,
            }}>
            Dog Game %
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: "right",
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 12,
              fontWeight: "400",
              padding: 10,
            }}>
            {this.state.stats.dogGameWin.toFixed(1)}%
          </Text>
        </View>
        <View style={{ flexDirection: "row", backgroundColor: "#191919" }}>
          <Text
            style={{
              flex: 1,
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 14,
              fontWeight: "600",
              padding: 10,
            }}>
            Rank in Division
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: "right",
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 12,
              fontWeight: "400",
              padding: 10,
            }}>
            {this.state.stats.rankDivision}
          </Text>
        </View>
        {/* <View style={{flexDirection: "row", backgroundColor: "#282828"}}>
          <Text
            style={{
              flex: 1,
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 14,
              fontWeight: "600",
              padding: 10,
            }}>
            Chips Won (Working on)
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: "right",
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 12,
              fontWeight: "400",
              padding: 10,
            }}>
            {this.state.stats.chipsWin}
          </Text>
        </View>
         */}
        <View style={{ flexDirection: "row", backgroundColor: "#282828" }}>
          <Text
            style={{
              flex: 1,
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 14,
              fontWeight: "600",
              padding: 10,
            }}>
            Parlays
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: "right",
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 12,
              fontWeight: "400",
              padding: 10,
            }}>
            {this.state.stats.parlays}
          </Text>
        </View>
        {/* <View style={{flexDirection: "row", backgroundColor: "#282828"}}>
          <Text
            style={{
              flex: 1,
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 14,
              fontWeight: "600",
              padding: 10,
            }}>
            Stacks (Working on)
          </Text>
          <Text
            style={{
              flex: 1,
              marginLeft: 5,
              textAlign: "right",
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 12,
              fontWeight: "400",
              padding: 10,
            }}>
            {this.state.stats.stacks}%
          </Text>
        </View> */}
        <ScrollView horizontal style={{ backgroundColor: "#191919", height: 110, }}>
          <View style={{ paddingHorizontal: 4, alignSelf: "center" }}>
            <View style={{ flexDirection: "row", }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(a =>
                <View style={{ backgroundColor: "#282828", height: 40, width: 100, borderColor: jaune, borderWidth: 1, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: jaune }}>Week {a}</Text>
                </View>

              )}
            </View>
            <View style={{ flexDirection: "row", }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(a =>
                <View style={{ backgroundColor: "#282828", height: 55, width: 100, borderColor: jaune, borderWidth: 1, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: jaune }}>{this.getPointsByWeek(a.toString())}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        <Text
          style={{
            color: "#585858",
            fontFamily: "Arial",
            fontSize: 10,
            fontWeight: "700",
            alignSelf: "center",
            marginTop: 50,
          }}>
          FOR THE GOOD OF THE LEAGUE
        </Text>
      </ScrollView>
    );
  }
  getPointsByWeek = (week) => {
    if (this.state.allBetsByWeek && this.state.allBetsByWeek.length > 0) {
      return this.state.allBetsByWeek.filter(f => f.week === week).reduce((a, b) => a + b.points, 0)
    } else {
      return 0;
    }

  }
}

const mapStateToProps = (state) => {
  const {
    herInfoUser,
    herBets,
    herParlays,
    herGroupUsers,
    herGroupBets,
    herGroupParlays,
  } = state.otherUser;
  const { players, currentWeek } = state.game;
  const { token, conferences,
    groups, } = state.user;
  return {
    players,
    currentWeek,
    token,
    conferences,
    groups,
    herInfoUser,
    herBets,
    herParlays,
    herGroupUsers,
    herGroupBets,
    herGroupParlays,
  };
};
export default connect(mapStateToProps, {
  getHerBets,
  getHerParlays,
  getHerGroupUsers,
  getHerGroupBets,
  getGroupParlays,
})(profileTab);
