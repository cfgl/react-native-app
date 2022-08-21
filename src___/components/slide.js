import * as React from "react";

import {View, ImageBackground, Text} from "react-native";

import Swiper from "react-native-web-swiper";

import {screenWidth} from "../utils/variables";
import {jaune} from "../styles/colors";

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  next = () => {
    // swiperRef.current.goTo(1);
    // swiperRef.current.goToPrev();
    this.swiperRef.current.goToNext();
    const index = this.swiperRef.current.getActiveIndex();
  };
  componentDidMount() {
    this.next();
  }
  render() {
    const {height} = this.props;
    this.swiperRef = React.createRef();
    return (
      <View style={{height: height, width: 400}}>
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

          controlsProps={{
            dotsTouchable: true,
            prevPos: "left",
            nextPos: "right",
            nextTitle: "",
            prevTitle: "",
            DotComponent: ({index, isActive, onPress}) => (
              <View
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: isActive ? jaune : "#333",
                  borderRadius: 4,
                  marginTop: 30,
                  marginLeft: 8,
                  marginRight: 8
                }}
              />
            )
          }}>
          {this.props.array.map((item, index) => (
            <View key={index}>
              <View
                key={JSON.stringify(item)}
                style={{
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,.0)",
                  height: 800,
                  borderRadius: 0,
                  marginTop: 120
                }}>
                <ImageBackground
                  source={item.url}
                  style={{width: 150, height: 150}}
                  resizeMode="contain"
                  borderRadius={0}
                />
                <Text
                  style={{
                    textAlign: "center",
                    width: "80%",

                    color: jaune,
                    fontFamily: "Monda",
                    fontSize: 40,
                    fontWeight: "400",
                    lineHeight: 45,
                    marginTop: 40
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
                    fontSize: 17,
                    fontWeight: "400",
                    lineHeight: 24
                  }}>
                  {item.subTitle}
                </Text>
              </View>
            </View>
          ))}
        </Swiper>
      </View>
    );
  }
}
