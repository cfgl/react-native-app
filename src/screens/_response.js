import React from "react";
import {Text, View, Image, Animated, StyleSheet} from "react-native";
import {Searchbar} from "react-native-paper";
import StickyParallaxHeader from "react-native-sticky-parallax-header";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import {FloatingAction} from "react-native-floating-action";
import {Ionicons} from "react-native-vector-icons";

const styles = StyleSheet.create({
  content: {
    marginTop: 20,
    alignItems: "center",
  },
  foreground: {
    paddingVertical: 30,
    backgroundColor: "#2E4053",
  },
  message: {
    color: "white",
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 7,
    fontWeight: "600",
  },
  headerWrapper: {
    backgroundColor: "#1ca75d",
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    color: "white",
    margin: 12,
  },
  tabsWrapper: {
    paddingVertical: 12,
  },
  tabTextContainerStyle: {
    backgroundColor: "transparent",
    borderRadius: 18,
  },
  tabTextContainerActiveStyle: {
    backgroundColor: "rgba(105,170,123,0.8)",
  },
  tabText: {
    fontSize: 16,
    lineHeight: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "white",
  },
});

const actions = [
  {
    text: "Faire une demande",
    icon: {uri: "https://image.flaticon.com/icons/svg/126/126508.svg"},
    name: "bt_ask",
    position: 1,
  },
  {
    text: "Parametres",
    icon: {uri: "https://image.flaticon.com/icons/svg/126/126508.svg"},
    name: "bt_settings",
    position: 2,
  },
];

export default class TabScreen extends React.Component {
  state = {
    scroll: new Animated.Value(0),
    firstQuery: "",
    viewContact: true,
  };

  componentDidMount() {
    const {scroll} = this.state;
    scroll.addListener(({value}) => (this._value = value));
  }

  renderContent = (list) => (
    <View style={styles.content}>
      {list.map((item) => (
        <View
          style={{
            height: 100,
            width: "96%",
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            marginTop: 10,
            elevation: 3,
          }}></View>
      ))}
    </View>
  );

  renderForeground = () => {
    const {scroll} = this.state;
    const titleOpacity = scroll.interpolate({
      inputRange: [0, 106, 154],
      outputRange: [1, 1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.foreground}>
        <Animated.View style={{opacity: titleOpacity}}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 40,
            }}>
            <View style={{justifyContent: "center"}}>
              <Image
                source={{
                  uri:
                    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
                }}
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 50,
                  alignSelf: "center",
                }}
              />
              <Text style={styles.message}>Leticia Midland</Text>
            </View>
            <View style={{alignItems: "center"}}>
              <Text style={{fontSize: 80, fontWeight: "900", color: "#fff"}}>
                8.4
              </Text>
              <Text style={{fontSize: 20, fontWeight: "500", color: "#fff"}}>
                Score
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  };

  renderHeader = () => {
    const {scroll} = this.state;
    const opacity = scroll.interpolate({
      inputRange: [0, 160, 210],
      outputRange: [0, 0, 1],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.headerWrapper}>
        <Animated.View style={{opacity}}>
          <Text style={styles.headerTitle}>STICKY HEADER</Text>
        </Animated.View>
      </View>
    );
  };

  render() {
    const {scroll, firstQuery} = this.state;

    return (
      <View style={{flex: 1, backgroundColor: "#fff"}}>
        <View>
          <View style={styles.foreground}>
            <Ionicons
              style={{
                position: "absolute",
                left: 0,
                top: 10,
                padding: 20,
                zIndex: 999,
              }}
              name="ios-arrow-back"
              size={30}
              color={"#fff"}
              onPress={() => this.props.navigation.goBack()}
            />
            <Animated.View style={{}}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 40,
                }}>
                <View style={{justifyContent: "center"}}>
                  <Image
                    source={{
                      uri:
                        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
                    }}
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 50,
                      alignSelf: "center",
                    }}
                  />
                  <Text style={[styles.message, {alignSelf: "center"}]}>
                    Merlin Simpson
                  </Text>
                </View>
                <View style={{alignItems: "center"}}>
                  <Text
                    style={{fontSize: 20, fontWeight: "500", color: "#fff"}}>
                    Score
                  </Text>
                  <Text
                    style={{fontSize: 80, fontWeight: "900", color: "#fff"}}>
                    9.5
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: "row", alignSelf: "flex-end"}}>
                <TouchableOpacity
                  style={{
                    height: 35,
                    width: 80,
                    marginRight: 20,
                    backgroundColor: "red",
                    borderRadius: 10,

                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text
                    style={{fontSize: 17, fontWeight: "900", color: "#fff"}}>
                    Reject
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    height: 35,
                    width: 80,
                    marginRight: 20,
                    backgroundColor: "green",
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text
                    style={{fontSize: 17, fontWeight: "900", color: "#fff"}}>
                    Accept
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>

          <View
            style={{
              height: 100,
              width: "96%",
              alignSelf: "center",
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              marginTop: 10,
              elevation: 3,
              padding: 15,
            }}>
            <Text style={{fontSize: 20, fontWeight: "600", color: "#000"}}>
              1 - Type de demande
            </Text>
            <Text
              style={{
                fontSize: 20,
                marginTop: 10,
                fontWeight: "600",
                color: "#aaa",
              }}>
              L'argent
            </Text>
          </View>

          <View
            style={{
              height: 150,
              width: "96%",
              alignSelf: "center",
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              marginTop: 10,
              elevation: 3,
              padding: 15,
            }}>
            <Text style={{fontSize: 20, fontWeight: "600", color: "#000"}}>
              2 - Description
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginTop: 10,
                fontWeight: "300",
                color: "#aaa",
              }}>
              {
                "Looking for some already great color combinations? Our color chart features flat design colors, Google's Material design scheme and the classic web safe color palette, all with Hex color codes."
              }
            </Text>
          </View>
          <View
            style={{
              height: 120,
              width: "96%",
              alignSelf: "center",
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              marginTop: 10,
              elevation: 3,
              padding: 15,
            }}>
            <Text style={{fontSize: 20, fontWeight: "600", color: "#000"}}>
              3 - Date d'echeance
            </Text>
            <Text
              style={{
                fontSize: 20,
                marginTop: 10,
                fontWeight: "600",
                color: "#aaa",
              }}>
              24 Avril 2020
            </Text>
            <Text
              style={{
                fontSize: 15,
                marginTop: 10,
                fontWeight: "600",
                color: "#aaa",
              }}>
              Periode: 14 jours
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
