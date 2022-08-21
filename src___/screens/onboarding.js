import React from "react";
import {
  View,
  StatusBar,
  ImageBackground,
  SafeAreaView,
  Text,
  Touchable,
} from "react-native";
import Slide from "../components/slide";
import { Button } from "react-native-paper";
import { jaune, noir } from "../styles/colors";
import Swiper from "react-native-web-swiper";
import { connect } from "react-redux";
import { introUser } from "../redux/actions/user";
import { TouchableOpacity } from "react-native-gesture-handler";
class Intro extends React.Component {
  constructor(props) {
    super(props);
    this.state = { from: 0, index: 0 };


  }
  render() {
    this.swiperRef = React.createRef();
    const height = 590;
    let index =
      this.swiperRef &&
        this.swiperRef.current &&
        this.swiperRef.current.getActiveIndex()
        ? this.swiperRef.current.getActiveIndex()
        : 0;
    return (
      <SafeAreaView
        style={{
          backgroundColor: noir,
          alignItems: "center",
          flex: 1,
        }}>
        <StatusBar backgroundColor="#ffffff" barStyle="light-content" />

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            borderRadius: 0,
            marginTop: 0,
            height,
          }}>
          <View style={{ height: height, width: 400 }}>
            <Swiper
              ref={this.swiperRef}
              from={this.props.from}
              minDistanceForAction={0.1}
              // controlsProps={{
              //   dotsTouchable: true,
              //   prevPos: "left",
              //   nextPos: "right",
              //   nextTitle: "",
              //   prevTitle: ""
              // }}
              onIndexChanged={(index) => {
                //alert(index);
                this.setState({ index: index });
              }}
              loop={true}
              controlsProps={{
                dotsTouchable: true,
                prevPos: "left",
                nextPos: "right",
                nextTitle: "",
                prevTitle: "",
                DotComponent: ({ index, isActive, onPress }) => (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor: isActive ? jaune : "#333",
                      borderRadius: 4,
                      marginTop: 30,
                      marginLeft: 8,
                      marginRight: 8,
                      marginBottom: 50,
                    }}
                  />
                ),
              }}>
              {[
                {
                  url: require("../images/onboard2.png"),
                  title: "Let’s get you all setup",
                  subTitle:
                    "Take a second to complete your profile. [Insert clever text here]",
                },
                {
                  url: require("../images/onboard1.png"),
                  title: "Some basic training before we start",
                  subTitle:
                    "We know you’re a pro, but all pros get better with training. That said swipe through to get a good understanding of how the app works",
                },
                {
                  url: require("../images/onboard2.png"),
                  title: "Let’s get you all setup",
                  subTitle:
                    "Take a second to complete your profile. [Insert clever text here]",
                },
              ].map((item, index) => (
                <View key={index}>
                  <View
                    key={JSON.stringify(item)}
                    style={{
                      alignItems: "center",
                      backgroundColor: "rgba(0,0,0,.0)",
                      height: 800,
                      borderRadius: 0,
                      marginTop: 100,
                    }}>
                    <ImageBackground
                      source={item.url}
                      style={{ width: 150, height: 150 }}
                      resizeMode="contain"
                      borderRadius={0}
                    />
                    <Text
                      style={{
                        textAlign: "center",
                        width: "80%",
                        color: jaune,
                        fontFamily: "Monda",
                        fontSize: 30,
                        fontWeight: "400",
                        lineHeight: 45,
                        marginTop: 40,
                      }}>
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        textAlign: "center",
                        marginLeft: 10,
                        width: "80%",
                        marginTop: 20,
                        marginBottom: 30,
                        color: jaune,
                        fontFamily: "Arial",
                        fontSize: 14,
                        fontWeight: "400",
                        lineHeight: 24,
                      }}>
                      {item.subTitle}
                    </Text>
                  </View>
                </View>
              ))}
            </Swiper>
          </View>

          {/* <Slide from={this.state.from} height={600} /> */}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            position: "absolute",
            bottom: 30,
          }}>
          <TouchableOpacity
            style={{
              width: 170,
              height: 50,
              alignSelf: "center",
              margin: 10,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 0,
              backgroundColor: "rgba(255,255,255,0.3)",
            }}


            onPress={() => this.props.navigation.navigate("Signin")}>
            <Text style={{
              paddingVertical: 10,
              fontFamily: "Arial",
              fontWeight: "700",
              color: jaune,
              paddingHorizontal: 0,
            }}>Skip</Text>
          </TouchableOpacity>
          {this.state.index < 2 ? (
            < TouchableOpacity
              style={{
                width: 170,
                height: 50,
                alignSelf: "center",
                justifyContent: "center",
                margin: 10,
                alignItems: "center",
                borderRadius: 0,
                backgroundColor: jaune,
              }}


              onPress={() => {
                this.swiperRef.current.goToNext();
                // const ind = this.swiperRef.current.getActiveIndex();
                // this.setState({index: ind + 1});
              }}>
              <Text style={{
                paddingVertical: 10,
                paddingHorizontal: 0,
                fontFamily: "Arial",
                color: noir,
                fontSize: 17,
                fontWeight: "700",
              }}>Next</Text>
            </TouchableOpacity>
          ) : (
              <TouchableOpacity
                style={{
                  width: 170,
                  height: 50,
                  alignSelf: "center",
                  justifyContent: "center",
                  margin: 10,
                  alignItems: "center",
                  borderRadius: 0,
                  backgroundColor: jaune,
                }}
                onPress={() => {
                  this.props.navigation.navigate("Signin");
                }}>
                <Text style={{
                  paddingVertical: 10,
                  paddingHorizontal: 0,
                  fontFamily: "Arial",
                  color: noir,
                  fontWeight: "700"
                }}>GET STARTED</Text>
              </TouchableOpacity>
            )}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  const { hasBoarded } = state.user;
  return { hasBoarded };
};
export default connect(mapStateToProps, { introUser })(Intro);
