import React, { Component } from "react";
import { Text, View, Image, ScrollView } from "react-native";
import { connect } from "react-redux";
import { getGroupBets, getPlayers } from "../redux/actions/game";
import { Ionicons } from "react-native-vector-icons";
import { betsGroupByWeek, gameString } from "../utils/functions";
import { SERVER } from '../redux/actionTypes'
import _ from "lodash";
import axios from 'axios'
import { jaune } from "../styles/colors";
import { Colors } from "react-native/Libraries/NewAppScreen";
class profileTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pts: 0,
      bets: [],
      nbParlay: 0,
      players: [],
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
    };
  }

  componentDidMount() {
    this.props.getGroupBets(this.props.user.group._id, this.props.token);
    this.props.getPlayers(null, this.props.token);

    let self = this;

    axios
      .get(`${SERVER}/bets/players?user._id=${this.props.user._id}`, {
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      })
      .then(function (response) {
        console.log(response.data.length);
        self.setState({ players: response.data });
      })
      .catch(function (error) {
        console.log(JSON.stringify(error, null, 2));

      });
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.players !== this.state.players &&
      this.state.players.length > 0
    ) {


      let weekGroup = betsGroupByWeek(this.state.players[0].results);

      let tab = [];
      weekGroup.map((w) => {
        let count = w.games.filter(
          (a) => a.canParlay === true && a.win === true
        ).length;
        let isParlayThisWeek = this.props.myParlay.filter(
          (f) => f.week == w.week
        ).length;

        tab.push({
          week: w.week,
          parlay: count === 3 && isParlayThisWeek === 1,
        });
      });


      let rankingList = _.orderBy(this.props.players, ["total"], ["desc"]);
      // console.log(rankingList);
      let userRanker = _.findIndex(
        rankingList,
        (o) => o.user._id === this.props.user._id
      );
      console.log(JSON.stringify(rankingList.map(a => a.user._id), null, 2));
      let topPlayerGames = rankingList.filter(
        (i) => i.user._id == this.props.user._id
      )[0].results;

      //console.log(topPlayerGames);

      if (this.props.user) {
        this.setState({
          pts: this.state.players.length > 0 ? this.state.players[0].total : 0,
          bets: topPlayerGames,
          stats: {
            powerGameWin: topPlayerGames.filter(
              (a) => a.betType.value === "power game"
            ).length
              ? (topPlayerGames.filter(
                (a) => a.win && a.betType.value === "power game"
              ).length /
                topPlayerGames.filter(
                  (a) => a.betType.value === "power game"
                ).length) *
              100
              : 0,
            bindingGameWin: topPlayerGames.filter(
              (a) => a.betType.value === "binding game"
            ).length
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

  chipsWon = (id) => {
    // Top players stats/////////////////////////=======================
    console.log("tttttttttttmmmmmmmmmmmmmmmmmmm");

    let rrrr = this.state.players.filter(
      (f) => f.user.group === this.props.user.group._id
    );

    console.log(JSON.stringify(rrrr.length, null, 2));

    // if (this.props.players.length > 0) {
    //   let _topPlayer = _.orderBy(this.props.players, ["total"], ["desc"])[0];

    //   //List games
    //   let toPlayerGames = _topPlayer.results;
    //   // Total points win
    //   let _topUserTotalPnt = _topPlayer.total;
    //   //Total games win
    //   let _topUserTotalGameWin = toPlayerGames.filter((a) => a.win).length;
    //   //Percentage games win
    //   let _topUserPercentGameWin = _topUserTotalGameWin / toPlayerGames.length;

    //   // this.setState({
    //   //   topPlayer: _topPlayer,
    //   //   topUserTotalPnt: _topUserTotalPnt,
    //   //   topUserPercentGameWin: _topUserPercentGameWin.toFixed(1) * 100,
    //   //   topUserTotalGameWin: _topUserTotalGameWin,
    //   // });
    // }
  };

  render() {
    return (
      <ScrollView style={{}}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 30,
            paddingHorizontal: 10,
          }}>
          <View
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
                this.props.user.avatar && this.props.user.avatar.url
                  ? { uri: this.props.user.avatar.url }
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
          </View>

          <View style={{ flex: 2, marginLeft: 10 }}>
            <Text
              style={{
                color: "#edd798",
                //fontFamily: "Monda",
                fontSize: 15,
                fontWeight: "700",
              }}>
              {this.props.user ? this.props.user.username : ""}
            </Text>
            <Text
              style={{
                color: "#edd798",
                fontFamily: "Arial",
                fontSize: 12,
                fontWeight: "400",
              }}>
              {this.props.user && this.props.user.city
                ? this.props.user.city
                : ""}
              ,{" "}
              {this.props.user && this.props.user.state
                ? this.props.user.state
                : ""}
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
              {this.props.user &&
                this.props.user.group &&
                this.props.user.group.name
                ? this.props.user.group.name
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
              {this.props.user &&
                this.props.user.conference &&
                this.props.user.conference.conferenceName
                ? this.props.user.conference.conferenceName.substring(0, 10)
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
          {this.state.bets.filter(f => f.week === this.props.currentWeek + "").map((item, index) => (
            <View
              key={index}
              style={{
                height: 76,
                justifyContent: "center",
                paddingHorizontal: 10,
                borderRightWidth: 0.2,
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
            {this.state.stats.stacks}
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
    if (this.state.players && this.state.players[0] && this.state.players[0].results) {
      return this.state.players[0].results.filter(f => f.week === week).reduce((a, b) => a + b.points, 0)
    } else {
      return 0;
    }

  }
}

const mapStateToProps = (state) => {
  const { conference, user, token, mygroupusers } = state.user;
  const {
    bets,
    weekBets,
    groupBets,
    myParlay,
    myGroupParlay,
    mygroupBets,
    players,
    currentWeek,
    currentYear
  } = state.game;
  return {
    conference,
    user,
    token,
    bets,
    weekBets,
    mygroupusers,
    groupBets,
    myParlay,
    myGroupParlay,
    mygroupBets,
    players,
    currentWeek,
    currentYear
  };
};
export default connect(mapStateToProps, { getGroupBets, getPlayers })(profileTab);
