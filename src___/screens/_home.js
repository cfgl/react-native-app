import React from "react";
import { Text, View, Image, Animated, StyleSheet } from "react-native";
import StickyParallaxHeader from "react-native-sticky-parallax-header";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { FloatingAction } from "react-native-floating-action";
const styles = StyleSheet.create({
  content: {
    height: 1000,
    marginTop: 20,
    alignItems: "center",
  },
  foreground: {
    justifyContent: "flex-end",
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
    backgroundColor: "#2E4053",
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
    backgroundColor: "#2E4053",
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
    icon: { uri: "https://image.flaticon.com/icons/svg/126/126508.svg" },
    name: "bt_ask",
    position: 1,
  },
  {
    text: "Parametres",
    icon: { uri: "https://image.flaticon.com/icons/svg/126/126508.svg" },
    name: "bt_settings",
    position: 2,
  },
];
export default class TabScreen extends React.Component {
  state = {
    scroll: new Animated.Value(0),
  };

  componentDidMount() {
    const { scroll } = this.state;
    scroll.addListener(({ value }) => (this._value = value));
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
    const { scroll } = this.state;
    const titleOpacity = scroll.interpolate({
      inputRange: [0, 106, 154],
      outputRange: [1, 1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.foreground}>
        <Animated.View style={{ opacity: titleOpacity }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 40,
              paddingTop: 50,
            }}>
            <View style={{ justifyContent: "center" }}>
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
              <Text style={styles.message}>Leticia Midland fsdfdsf fsdf sdf </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "500", color: "#fff" }}>
                Score
              </Text>
              <Text style={{ fontSize: 80, fontWeight: "900", color: "#fff" }}>
                8.4
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  };

  renderHeader = () => {
    const { scroll } = this.state;
    const opacity = scroll.interpolate({
      inputRange: [0, 160, 210],
      outputRange: [0, 0, 1],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.headerWrapper}>
        <Animated.View style={{ opacity }}>
          <Text style={styles.headerTitle}>STICKY HEADER</Text>
        </Animated.View>
      </View>
    );
  };

  render() {
    const { scroll } = this.state;

    return (
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <StickyParallaxHeader
          foreground={this.renderForeground()}
          header={this.renderHeader()}
          parallaxHeight={200}
          headerHeight={30}
          headerSize={() => { }}
          onEndReached={() => { }}
          backgroundColor={"#2E4053"}
          scrollEvent={Animated.event([
            { nativeEvent: { contentOffset: { y: scroll } } },
          ])}
          tabs={[
            {
              title: "Demande",
              content: (
                <View style={{}}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <TouchableOpacity
                      onPress={() => this.props.navigation.navigate("Response")}
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
                        margin: 10,
                        flexDirection: "row",
                        alignItems: "center",
                      }}>
                      <Image
                        source={{
                          uri:
                            "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
                        }}
                        style={{
                          height: 60,
                          width: 60,
                          borderRadius: 30,
                          alignSelf: "center",
                          marginRight: 10,
                        }}
                      />
                      <View>
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: "600",
                            color: "#000",
                          }}>
                          John Bob Legran
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            marginTop: 5,
                            fontWeight: "600",
                            color: "#aaa",
                          }}>
                          Score: 5.7
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            marginTop: 5,
                            fontWeight: "600",
                            color: "#aaa",
                          }}>
                          Argent
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ),
            },
            {
              title: "Attente",
              content: this.renderContent([1]),
            },
            {
              title: "Accord",
              content: this.renderContent([1, 2]),
            },
            {
              title: "Rejetée",
              content: this.renderContent([1, 2, 3, 4]),
            },
          ]}
          tabTextStyle={styles.tabText}
          tabTextContainerStyle={styles.tabTextContainerStyle}
          tabTextContainerActiveStyle={styles.tabTextContainerActiveStyle}
          tabsContainerBackgroundColor={"#2E4053"}
          tabsWrapperStyle={styles.tabsWrapper}></StickyParallaxHeader>

        <FloatingAction
          actions={actions}
          onPressItem={(name) => {
            if (name === "bt_ask") {
              this.props.navigation.navigate("Ask");
            }
            console.log(`selected button: ${name}`);
          }}
        />
      </View>
    );
  }
}
