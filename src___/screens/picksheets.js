import React, { Component } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal
} from "react-native";

import { SCREEN_WIDTH } from "../utils/variables";
import { jaune, noir, gris } from "../styles/colors";
import { Ionicons } from "react-native-vector-icons";
import ActionSheet from "react-native-actionsheet";
import { connect } from "react-redux";
import { getWeekBets, setGameStatus, getPlayers } from "../redux/actions/game";

import { setHerInfoUser, getHerParlays } from "../redux/actions/otherUser";

import { getGroups } from "../redux/actions/user";
import { gameString } from '../utils/functions'
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 60 : 73;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
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
  "Week 16",
  "Week 17",
  "Cancel",
];
class PickSheet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      refreshing: false,
      week: this.props.seasonStatus && this.props.seasonStatus === "STARTED" ? this.props.currentWeek : this.props.seasonStatus === "FINISHED" ? this.props.weekstartdate.length : 1,
      scrollY: new Animated.Value(
        // iOS has negative initial scroll value because content inset...
        Platform.OS === "ios" ? -HEADER_MAX_HEIGHT : 0
      ),
      refreshing: false,
      usersGroup: [],
      group: this.props.user.group,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.statusGame !== this.props.statusGame &&
      this.props.statusGame === "SUCCESS_GET_PLAYERS"
    ) {
      this.setState({
        usersGroup: this.props.players.filter(
          (p) => p.user.group === this.props.user.group._id
        ),
      });
    }
  }

  componentDidMount() {
    this.props.getPlayers(null, this.props.token);
    this.props.getGroups();
    this.props.getWeekBets(
      this.props.currentYear,
      this.props.currentWeek,
      this.props.token
    );
    this.setState({
      usersGroup: this.props.players.filter(
        (p) => p.user.group === this.props.user.group._id
      ),
    }, () => {

    });
  }
  showGroup = () => {
    this.group_.show();
  };
  showWeek = () => {
    this.week_.show();
  };
  game = (bets, type, week) => {

    let bet = bets.filter(
      (i) => i.week == week && i.betType.value == type
    );
    if (bet.length > 0) {
      return `${gameString(bet[0].game.GameFull)}- ${bet[0].betMethod.value.toUpperCase()} \nScore : ${bet[0].game.FavoriteScore || 0} - ${bet[0].game.UnderdogScore || 0} `;
    } else {
      return "";
    }
  };

  isGameWin = (bets, type, week) => {
    let bet = bets.filter(
      (i) => i.week == week && i.betType.value === type
    );
    if (bet.length > 0) {

      if (bet[0].game.GameFull.Status === "Final" || bet[0].game.GameFull.Status === "F/OT") {

        if (bet[0].win == true && bet[0].game.rats !== "PUSH") {
          return "green"
        } else if (bet[0].win == true && bet[0].game.rats === "PUSH") {
          return "orange"
        } else if (bet[0].win == false) {
          return "red"
        }


      } else {
        return jaune
      }


      // return bet[0].game.GameFull.Status === "Final" || bet[0].game.GameFull.Status === "F/OT"
      //   ? bet[0].win == true && bet[0].game.rats !=="PUSH"
      //     ? "green"
      //       ? bet[0].win == false && bet[0].game.rats !== "PUSH"
      //     : "red"
      //         ? bet[0].win == true && bet[0].game.rats === "PUSH"
      //         : "orange"
      //   : jaune;
    } else {
      return "#fff";
    }
  };
  getGameResult = (bets, type, week) => {
    let bet = bets.filter(
      (i) => i.week == week && i.betType.value === type
    );
    if (bet.length > 0) {
      // bet[0].game.GameFull = {};
      //alert(JSON.stringify(bet[0].game.points))
      return bet[0]
    } else {
      return {};
    }
  };
  _showModal = () => this.setState({ visible: true });
  _hideModal = () => this.setState({ visible: false });

  onRefresh = () => {
    this.setState({ refreshing: true });

    this.props.getPlayers(null, this.props.token);
    this.props.getGroups();
    this.props.getWeekBets(
      this.props.currentYear,
      this.props.currentWeek,
      this.props.token
    );
    this.setState({
      usersGroup: this.props.players.filter(
        (p) => p.user.group === this.props.user.group._id
      ),
    }, () => {

    });
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 2000);
  };


  render() {
    const { group, week } = this.state;
    // Because of content inset the scroll value will be negative on iOS so bring
    // it back to 0.
    const scrollY = Animated.add(
      this.state.scrollY,
      Platform.OS === "ios" ? 1 : 0
    );
    const headerTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: "clamp",
    });



    return (
      <ScrollView style={{}} refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
        />
      }>
        <MyPicks
          name="CFGL CONFERENCE"
          group={group && group.name ? group.name : "SELECT CFGL CONFERENCE"}
          week={week ? week : "SELECT WEEK"}
          showGroup={() => this.showGroup()}
          showWeek={() => this.showWeek()}
        />

        <View
          style={{
            flexDirection: "row",

          }}>




          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            marginRight: 10
          }}>
            <View style={{ width: 8, height: 8, backgroundColor: jaune }} />
            <Text style={{ margin: 10, fontSize: 10, color: "#fff" }}>Scheduled</Text>
          </View>

          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}>
            <View style={{ width: 8, height: 8, backgroundColor: "red" }} />
            <Text style={{ margin: 10, fontSize: 10, color: "#fff" }}>Loose</Text>
          </View>

          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 0,
            flex: 1,
          }}>
            <View style={{ width: 8, height: 8, backgroundColor: "orange" }} />
            <Text style={{ margin: 10, fontSize: 10, color: "#fff" }}>Tie</Text>
          </View>




          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}>
            <View style={{ width: 8, height: 8, backgroundColor: "green" }} />
            <Text style={{ margin: 10, color: "#fff" }}>Win</Text>
          </View>


        </View>
        <View
          style={{
            flexDirection: "row",
            borderBottomColor: noir,
            borderBottomWidth: 1,
          }}>
          <Animated.ScrollView
            // pointerEvents="none"
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={[styles.fill, { transform: [{ translateY: headerTranslate }] }]}
            bounces={false}
            contentInset={{
              top: 0,
            }}
            contentOffset={{
              y: 0,
            }}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 0.4,
                height: 40,
                alignItems: "center",
              }}>
              <Text
                style={{
                  width: 0,
                  color: "#edd798",
                  fontFamily: "Arial",
                  fontSize: 14,
                  fontWeight: "400",
                  marginLeft: 10,
                }}></Text>
              <Text
                style={{
                  width: 150,
                  color: "#edd798",
                  fontFamily: "Arial",
                  fontSize: 16,
                  fontWeight: "900",
                  marginLeft: 0,
                }}>
                PLAYERS
              </Text>
            </View>
            {this.state.usersGroup.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  this.props.getHerParlays(item.user._id, this.props.token);
                  this.props.setHerInfoUser(item.user);
                  this.props.navigation.navigate("ProfileStatistics");
                }}
                key={index}
                style={{
                  //borderRightColor: "rgba(255,255,255,0.05)",
                  //borderRightWidth: 4,
                  alignItems: "center",
                  backgroundColor: index % 2 == 0 ? "#191919" : "#282828",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 40,
                }}>
                {Platform.OS === "ios" &&
                  <View
                    style={{
                      width: 120,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      backgroundColor: index % 2 == 0 ? "#191919" : "#282828",

                      height: 50,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 5,
                        height: 8,
                      },
                      shadowOpacity: 0.29,
                      shadowRadius: 4.65,

                      elevation: 7,
                    }}
                  />}
                <Text
                  style={{
                    width: 150,
                    color: jaune,
                    fontFamily: "Arial",
                    fontSize: 12,
                    fontWeight: "400",
                    marginLeft: 40,
                  }}>
                  #{item.user.username.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.ScrollView>
          <Animated.ScrollView
            horizontal
            bounces={false}
            showsHorizontalScrollIndicator={false}
            style={styles.fill}
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              { useNativeDriver: true }
            )}
            // iOS offset for RefreshControl
            contentInset={{
              top: 0,
            }}
            contentOffset={{
              y: 0,
            }}>
            <View>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.visible}
                onRequestClose={() => {
                  this._hideModal()
                }}
              >
                <View style={{ alignSelf: "center", marginTop: 50, height: this.state.selected && this.state.selected.game ? 550 : 100, width: 300, backgroundColor: "#fff" }}>

                  <TouchableOpacity onPress={this._hideModal} style={{ padding: 10, position: "absolute", top: 10, right: 10, zIndex: 999 }}>
                    <Text style={{ color: "red" }}>Close</Text>

                  </TouchableOpacity>
                  {this.state.selected && !this.state.selected.game &&
                    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}><Text style={{ fontSize: 20, }}>{"No Game Found"}</Text></View>}
                  {this.state.selected && this.state.selected.game &&
                    <View style={{ padding: 20, marginTop: 30 }}>
                      <View style={{
                        borderWidth: 1,
                        borderColor: "#eee",
                        padding: 10,
                        marginBottom: 10
                      }}>
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"Game "}</Text>
                          <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.Game}</Text>
                        </View>

                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"Spread "}</Text>
                          <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.Spread}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"Over/Under "}</Text>
                          <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.ou}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"Away Team "}</Text>
                          <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.AwayTeam}</Text>
                        </View>
                        {/* <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"Away $Line "}</Text>
                          <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.AwayTeamMoneyLine}</Text>
                        </View> */}
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"Home Team "}</Text>
                          <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.HomeTeam}</Text>
                        </View>


                        {/* <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"Home $Line "}</Text>
                          <Text style={{ flex: 3, fontSize: 12 }}>: {this.state.selected.game.HomeTeamMoneyLine}</Text>
                        </View> */}
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"Fave "}</Text>
                          <Text style={{ flex: 3, fontSize: 12, fontWeight: "700" }}>: {this.state.selected.game.Fave}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"Dog "}</Text>
                          <Text style={{ flex: 3, fontSize: 12, fontWeight: "700" }}>: {this.state.selected.game.Dog}</Text>
                        </View>


                      </View>
                      <View style={{
                        borderWidth: 1,
                        borderColor: "#eee",
                        padding: 10
                      }}>
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"Bet on "}</Text>
                          <Text style={{ flex: 3, fontSize: 12, fontWeight: "700" }}>: {this.state.selected.betMethod.value.toUpperCase()}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"Fav. Score "}</Text>
                          <Text style={{ flex: 3, fontSize: 12, fontWeight: "700" }}>: {this.state.selected.game.FavoriteScore}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"Dog Score "}</Text>
                          <Text style={{ flex: 3, fontSize: 12, fontWeight: "700" }}>: {this.state.selected.game.UnderdogScore}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"O/U result "}</Text>
                          <Text style={{ flex: 3, fontSize: 12, fontWeight: "700" }}>: {this.state.selected.game.ou_score}</Text>
                        </View>

                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"Score diff. "}</Text>
                          <Text style={{ flex: 3, fontSize: 12, fontWeight: "700" }}>: {this.state.selected.game.FavoriteScore - this.state.selected.game.UnderdogScore}</Text>
                        </View>

                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"Win"}</Text>
                          <Text style={{ flex: 3, fontSize: 12, fontWeight: "700" }}>: {this.state.selected.win ? "Yes" : "No"}</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginBottom: 10 }}>
                          <Text style={{ flex: 2, fontSize: 12 }}>{"Points"}</Text>
                          <Text style={{ flex: 3, fontSize: 12, fontWeight: "700" }}>: {this.state.selected.points}</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 10, marginTop: 10, color: "orange" }}>{`NB: Favorite or Dog team is based on the spread.\nif spread is negative (<0) Home team is favorite else Away team is favorite\n\nSource: https://sportsdata.io`}</Text>
                    </View>}

                </View>
              </Modal>
              <View
                style={{
                  flexDirection: "row",
                  height: 40,
                  alignItems: "center",
                }}>
                <Text
                  style={{
                    width: 190,
                    color: "#edd798",
                    fontFamily: "Arial",
                    fontSize: 16,
                    fontWeight: "900",
                    marginLeft: 20,
                  }}>
                  POWER GAME
                </Text>
                <Text
                  style={{
                    width: 190,
                    color: "#edd798",
                    fontFamily: "Arial",
                    fontSize: 16,
                    fontWeight: "900",
                    marginLeft: 10,
                  }}>
                  BINDDING GAME
                </Text>
                <Text
                  style={{
                    width: 190,
                    color: "#edd798",
                    fontFamily: "Arial",
                    fontSize: 16,
                    fontWeight: "900",
                    marginLeft: 10,
                  }}>
                  FREE PICK 1
                </Text>
                <Text
                  style={{
                    width: 190,
                    color: "#edd798",
                    fontFamily: "Arial",
                    fontSize: 16,
                    fontWeight: "900",
                    marginLeft: 10,
                  }}>
                  FREE PICK 2
                </Text>
                <Text
                  style={{
                    width: 190,
                    color: "#edd798",
                    fontFamily: "Arial",
                    fontSize: 16,
                    fontWeight: "900",
                    marginLeft: 10,
                  }}>
                  FREE PICK 3
                </Text>
                <Text
                  style={{
                    width: 190,
                    color: "#edd798",
                    fontFamily: "Arial",
                    fontSize: 16,
                    fontWeight: "900",
                    marginLeft: 10,
                  }}>
                  DOG GAME
                </Text>
              </View>
              <FlatList
                style={{ marginTop: -0.1 }}
                bounces={false}
                data={this.state.usersGroup}
                keyExtractor={({ index }) => index}
                renderItem={({ item, index }) => {
                  let rest = this.state.usersGroup[index].results;
                  return (
                    <View
                      onPress={() => {


                      }}
                      style={{
                        flexDirection: "row",

                        alignItems: "center",
                        backgroundColor: index % 2 == 0 ? "#191919" : "#282828",
                      }}>
                      <View
                        style={{
                          backgroundColor: "rgba(0,0,0,.0)",
                          width: 10,
                          height: 40,
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 1,
                            height: 1,
                          },
                          shadowOpacity: 0.58,
                          shadowRadius: 16.0,

                          elevation: 24,
                        }}
                      />
                      <TouchableOpacity onPress={() => {

                        this.setState({ selected: this.getGameResult(rest, "power game", this.state.week) }, () => {
                          this._showModal();
                        })
                      }}>
                        <Text
                          style={{
                            width: 190,
                            color: this.isGameWin(item.results, "power game", this.state.week),
                            fontFamily: "Arial",
                            fontSize: 12,
                            fontWeight: "400",
                            marginLeft: 10,
                          }}>
                          {this.game(item.results, "power game", this.state.week)}

                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => {
                        this.setState({ selected: this.getGameResult(rest, "binding game", this.state.week) }, () => {
                          this._showModal();
                        })
                      }}>
                        <Text
                          style={{
                            width: 190,
                            color: this.isGameWin(item.results, "binding game", this.state.week),
                            fontFamily: "Arial",
                            fontSize: 12,
                            fontWeight: "400",
                            marginLeft: 10,
                          }}>
                          {this.game(item.results, "binding game", this.state.week)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        this.setState({ selected: this.getGameResult(rest, "pick1", this.state.week) }, () => {
                          this._showModal();
                        })
                      }}>
                        <Text
                          style={{
                            width: 190,
                            color: this.isGameWin(item.results, "pick1", this.state.week),
                            fontFamily: "Arial",
                            fontSize: 12,
                            fontWeight: "400",
                            marginLeft: 10,
                          }}>
                          {this.game(item.results, "pick1", this.state.week)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        this.setState({ selected: this.getGameResult(rest, "pick2", this.state.week) }, () => {
                          this._showModal();
                        })
                      }}>
                        <Text
                          style={{
                            width: 190,
                            color: this.isGameWin(item.results, "pick2", this.state.week),
                            fontFamily: "Arial",
                            fontSize: 12,
                            fontWeight: "400",
                            marginLeft: 10,
                          }}>
                          {this.game(item.results, "pick2", this.state.week)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        this.setState({ selected: this.getGameResult(rest, "pick3", this.state.week) }, () => {
                          this._showModal();
                        })
                      }}>
                        <Text
                          style={{
                            width: 190,
                            color: this.isGameWin(item.results, "pick3", this.state.week),
                            fontFamily: "Arial",
                            fontSize: 12,
                            fontWeight: "400",
                            marginLeft: 10,
                          }}>
                          {this.game(item.results, "pick3", this.state.week)}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        this.setState({ selected: this.getGameResult(rest, "dog game", this.state.week) }, () => {
                          this._showModal();
                        })
                      }}>
                        <Text
                          style={{
                            width: 190,
                            color: this.isGameWin(item.results, "dog game", this.state.week),
                            fontFamily: "Arial",
                            fontSize: 12,
                            fontWeight: "400",
                            marginLeft: 10,
                          }}>
                          {this.game(item.results, "dog game", this.state.week)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )
                }

                }
                keyExtractor={(item) => item.id}
              />
            </View>
          </Animated.ScrollView>
        </View>

        <ActionSheet
          ref={(o) => (this.group_ = o)}
          title={"Select the conference."}
          options={this.props.groups.map((i) => i.name).concat(["Cancel"])}
          cancelButtonIndex={this.props.groups.length}
          // destructiveButtonIndex={1}
          onPress={(index) => {
            if (index != this.props.groups.length) {
              this.setState({ group: this.props.groups[index] }, () => {
                this.setState({
                  usersGroup: this.props.players.filter(
                    (p) => p.user.group === this.state.group._id
                  ),
                });
              });
            }


          }}
        />
        <ActionSheet
          ref={(o) => (this.week_ = o)}
          title={"Select week."}
          options={weekList.map((i) => i)}
          cancelButtonIndex={weekList.length - 1}
          // destructiveButtonIndex={1}
          onPress={(index) => {
            if (index != weekList.length - 1)
              this.setState({
                week: index + 1,
              });

          }}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    //height: 1300
    //backgroundColor: "blue"
  },
  fill2: {
    flex: 1,
    backgroundColor: "red",
  },
  content: {
    flex: 1,
  },
  header: {
    flex: 1,
    // position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // backgroundColor: "#03A9F4",
    // overflow: "hidden",
    //height: HEADER_MAX_HEIGHT
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: "cover",
  },
  bar: {
    backgroundColor: "transparent",
    marginTop: Platform.OS === "ios" ? 28 : 38,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: "white",
    fontSize: 18,
  },
  scrollViewContent: {
    // iOS uses content inset, which acts like padding.
    // paddingTop: Platform.OS !== "ios" ? HEADER_MAX_HEIGHT : 0
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
  },
});

class MyPicks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      isSwitchOn: false,
    };
  }
  render() {
    const { name, group, showGroup, showWeek, week } = this.props;
    return (
      <View
        style={{
          width: "90%",

          backgroundColor: noir,
          paddingVertical: 20,
          padding: 20,
          margin: 20,
          alignSelf: "center",
        }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            borderBottomColor: jaune,
            borderBottomWidth: 1,
            height: 30,
          }}>
          <Text style={{ color: jaune, fontSize: 15, fontWeight: "bold" }}>
            {name.toUpperCase()}
          </Text>
        </View>

        <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={showGroup}
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",

              marginVertical: 20,
            }}>
            <View

              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                height: 50,
                backgroundColor: gris,
                alignItems: "center",
                paddingHorizontal: 20,
                marginHorizontal: 5
              }}>
              <Text style={{ color: jaune, fontSize: 12, fontWeight: "400" }}>
                {group.length > 15 ? group.substring(0, 15) + "." : group}
              </Text>
              <Ionicons name={"ios-arrow-down"} color={jaune} size={20} style={{ marginRight: 10 }} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showWeek}
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",

              marginVertical: 20,
            }}>
            <View

              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                height: 50,
                marginHorizontal: 5,
                backgroundColor: gris,
                alignItems: "center",
                paddingHorizontal: 30,
              }}>
              <Text style={{ color: jaune, fontSize: 12, fontWeight: "400" }}>
                {"Week " + week}
              </Text>
              <Ionicons name={"ios-arrow-down"} color={jaune} size={20} style={{ marginLeft: 10 }} />
            </View>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { user, token, conferences, conference, groups, usersgroup } = state.user;
  const {
    bets,
    players,
    playersByWeek,
    weekBets,
    currentYear,
    currentWeek,
    statusGame,
    weekstartdate,
    seasonStatus
  } = state.game;
  return {
    user,
    token,
    players,
    playersByWeek,
    conferences,
    conference,
    bets,
    statusGame,
    groups,
    usersgroup,
    weekBets,
    currentYear,
    currentWeek,
    weekstartdate,
    seasonStatus
  };
};
export default connect(mapStateToProps, {
  getWeekBets,
  setGameStatus,
  getPlayers,
  getGroups,
  setHerInfoUser,
  getHerParlays,
})(PickSheet);
