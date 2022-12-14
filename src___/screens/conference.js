import React, { Component } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  View,
  FlatList,
  Image,
} from "react-native";
import _ from "lodash";
import { jaune, noir } from "../styles/colors";
import { connect } from "react-redux";
import { setGameStatus, getPlayers } from "../redux/actions/game";
import { gameString } from '../utils/functions'
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 60 : 73;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class PickSheet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(
        // iOS has negative initial scroll value because content inset...
        Platform.OS === "ios" ? -HEADER_MAX_HEIGHT : 0
      ),
      refreshing: false,
      group: this.props.user.group,
      players: [],
    };

    this.props.getPlayers(null, this.props.token);
  }

  componentDidMount() { }

  game = (bets, user, type) => {
    let bet = bets.filter((i) => i.user._id == user && i.type.value == type);
    if (bet.length > 0) {
      return gameString(bet[0].game);
    } else {
      return "";
    }
  };

  componentDidUpdate(prevProps) { }
  render() {
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
      <ScrollView style={{}}>
        <View style={{ backgroundColor: "#fff", marginTop: 0 }}>
          <Image
            source={
              this.props.user.group
                ? { uri: this.props.user.group.image.url }
                : require("../images/HomeHeader.jpg")
            }
            style={{
              width: "80%",
              height: 200,
              resizeMode: "contain",
              alignSelf: "center",
            }}
          />
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
            style={[styles.fill, { transform: [{ translateY: headerTranslate }] }]}
            bounces={false}
            // scrollEventThrottle={1}
            // onScroll={Animated.event(
            //   [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
            //   {useNativeDriver: true}
            // )}
            // // iOS offset for RefreshControl
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
                HANDLER
              </Text>
              <Text
                style={{
                  width: 210,
                  color: "#edd798",
                  fontFamily: "Arial",
                  fontSize: 16,
                  fontWeight: "900",
                  marginLeft: 0,
                  textAlign: "center",
                }}>
                POINTS
              </Text>
            </View>
            {_.orderBy(
              this.props.players.filter(
                (a) => a.user.group === this.props.user.group._id
              ),
              ["total"],
              ["desc"]
            ).map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  height: 40,
                  alignItems: "center",
                  backgroundColor: index % 2 == 0 ? "#191919" : "#282828",
                }}>
                <Text
                  style={{
                    width: 15,
                    color: jaune,
                    fontFamily: "Arial",
                    fontSize: 12,
                    fontWeight: "400",
                    marginLeft: 10,
                  }}>
                  {index}
                </Text>
                <Text
                  style={{
                    width: 150,
                    color: jaune,
                    fontFamily: "Arial",
                    fontSize: 12,
                    fontWeight: "400",
                    marginLeft: 10,
                  }}>
                  #{item.user.username.toUpperCase()}
                </Text>
                <Text
                  style={{
                    width: 150,
                    color: "#edd798",
                    fontFamily: "Arial",
                    fontSize: 12,
                    fontWeight: "400",
                    marginLeft: 10,
                    textAlign: "center",
                  }}>
                  {item.total}
                </Text>
              </View>
            ))}
          </Animated.ScrollView>
        </View>
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

const mapStateToProps = (state) => {
  const {
    user,
    token,
    conferences,
    conference,
    groups,
    mygroupusers,
  } = state.user;
  const {
    bets,
    weekBets,
    currentYear,
    currentWeek,
    players,
    statusGame,
  } = state.game;
  return {
    user,
    token,
    conferences,
    conference,
    bets,
    groups,
    mygroupusers,
    weekBets,
    currentWeek,
    currentYear,
    players,
    statusGame,
  };
};
export default connect(mapStateToProps, {
  getPlayers,
  setGameStatus,
})(PickSheet);
