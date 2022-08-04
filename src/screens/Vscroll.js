// import React from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   ScrollView,
//   TouchableOpacity,
//   Animated,
//   Button
// } from "react-native";

// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// export default class Hscroll extends React.Component {
//   constructor() {
//     super();

//     this.state = {
//       data: DATA,
//       pageData: DATA,
//       scrol: 0
//     };
//   }

//   renderCheckHeader() {
//     const {header, col} = styles;

//     return (
//       <TouchableOpacity>
//         <View style={header}>
//           <View style={col}>
//             <Text>Checkbox</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   }

//   renderCheckRow(item) {
//     const {row, col} = styles;

//     return (
//       <TouchableOpacity>
//         <View style={row}>
//           <View style={col}>
//             <Text>Checkbox</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   }

//   renderHeader() {
//     const {header, col} = styles;

//     return (
//       <TouchableOpacity>
//         <View style={header}>
//           <View style={col}>
//             <Text>Code</Text>
//           </View>
//           <View style={col}>
//             <Text>Name</Text>
//           </View>
//           <View style={col}>
//             <Text>Subregion</Text>
//           </View>
//           <View style={col}>
//             <Text>City</Text>
//           </View>
//           <View style={col}>
//             <Text>Last visit</Text>
//           </View>
//           <View style={col}>
//             <Text>Days</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   }

//   renderRow(item) {
//     const {row, col} = styles;

//     return (
//       <TouchableOpacity>
//         <View style={row}>
//           <View style={col}>
//             <Text>{item.code}</Text>
//           </View>
//           <View style={col}>
//             <Text>{item.name}</Text>
//           </View>
//           <View style={col}>
//             <Text>{item.subregion}</Text>
//           </View>
//           <View style={col}>
//             <Text>{item.city}</Text>
//           </View>
//           <View style={col}>
//             <Text>{item.last_visit}</Text>
//           </View>
//           <View style={col}>
//             <Text>{item.days}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   }

//   renderSeparator() {
//     return <View style={styles.separator} />;
//   }
//   scrollToIndex = () => {
//     let randomIndex = Math.floor(Math.random(Date.now()) * DATA.length);
//     //this.checkScroll.scrollToIndex({animated: true, index: randomIndex});
//     this.refs.checkScroll.scrollToIndex({animated: true, index: 0});
//   };
//   render() {
//     return (
//       <View style={styles.container}>
//         <View style={styles.tableContent}>
//           <Button
//             onPress={() => this.scrollToIndex()}
//             title="Tap to scrollToIndex"
//             color="darkblue"
//           />
//           <AnimatedFlatList
//             style={{backgroundColor: "#ccc"}}
//             scrollToIndex
//             ref={instance => {
//               this.checkScroll = instance;
//             }}
//             keyExtractor={item => item.key}
//             data={this.state.data}
//             ListHeaderComponent={() => this.renderCheckHeader()}
//             renderItem={({item}) => this.renderCheckRow(item)}
//             ItemSeparatorComponent={() => this.renderSeparator()}
//             onScroll={() => console.log("Checkbox scroll event")}
//           />
//           <ScrollView
//             horizontal
//             onScroll={() => console.log("Data horizontal scroll event")}>
//             <AnimatedFlatList
//               style={styles.list}
//               ref={instance => {
//                 this.dataScroll = instance;
//               }}
//               keyExtractor={item => item.key}
//               data={this.state.data}
//               ListHeaderComponent={() => this.renderHeader()}
//               renderItem={({item}) => this.renderRow(item)}
//               ItemSeparatorComponent={() => this.renderSeparator()}
//               onScroll={event => {
//                 console.log(event.nativeEvent.contentOffset.y);
//               }}
//             />
//           </ScrollView>
//         </View>
//       </View>
//     );
//   }
// }

// const styles = {
//   container: {
//     flex: 1,
//     backgroundColor: "#999",
//     paddingTop: 50,
//     height: 400
//   },
//   paginationContent: {
//     flexDirection: "row"
//   },
//   tableContent: {
//     flexDirection: "row"
//   },
//   list: {
//     // flex: 1,
//     // backgroundColor: '#ccc'
//   },
//   header: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between"
//     // backgroundColor: 'red'
//   },
//   row: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between"
//     // backgroundColor: 'orange',
//   },
//   col: {
//     borderRightWidth: 1,
//     // backgroundColor: '#f8f8f8',
//     width: 130,
//     padding: 5,
//     justifyContent: "center",
//     alignItems: "center"
//   },
//   separator: {
//     height: 1,
//     backgroundColor: "black"
//   }
// };

// const DATA = [
//   {
//     key: 1,
//     id: "5993f8c8891124f2a474176f",
//     index: 0,
//     name: "Marisa Mullen",
//     code: "P343545",
//     subregion: "Kansas",
//     city: "Drytown",
//     last_visit: "2017-07-05 08:46",
//     days: 52,
//     visible: false,
//     checked: false
//   },
//   {
//     key: 2,
//     id: "5993f8c870241a7352ccfdb7",
//     index: 1,
//     name: "Owens Case",
//     code: "P604434",
//     subregion: "Connecticut",
//     city: "Gorst",
//     last_visit: "2017-06-06 04:20",
//     days: 34,
//     visible: false,
//     checked: false
//   },
//   {
//     key: 3,
//     id: "5993f8c8729a8fe6f1289b62",
//     index: 2,
//     name: "Katie Tillman",
//     code: "P699230",
//     subregion: "Vermont",
//     city: "Welch",
//     last_visit: "2017-04-14 11:33",
//     days: 3,
//     visible: false,
//     checked: false
//   },
//   {
//     key: 4,
//     id: "5993f8c83721c7d6feca41a7",
//     index: 3,
//     name: "Shelton Dorsey",
//     code: "P744243",
//     subregion: "Tennessee",
//     city: "Grill",
//     last_visit: "2017-03-04 09:31",
//     days: 26,
//     visible: false,
//     checked: true
//   },
//   {
//     key: 5,
//     id: "5993f8c812288395c1cd631f",
//     index: 4,
//     name: "Lucille Sears",
//     code: "P931939",
//     subregion: "Arkansas",
//     city: "Lewis",
//     last_visit: "2017-01-27 03:28",
//     days: 90,
//     visible: false,
//     checked: true
//   },
//   {
//     key: 6,
//     id: "5993f8c82c51463dbb77022c",
//     index: 5,
//     name: "Mckay Leonard",
//     code: "P340714",
//     subregion: "South Carolina",
//     city: "Brecon",
//     last_visit: "2017-05-12 08:36",
//     days: 22,
//     visible: false,
//     checked: false
//   },
//   {
//     key: 11,
//     id: "5993f8c8891124f2a474176f",
//     index: 0,
//     name: "Marisa Mullen",
//     code: "P343545",
//     subregion: "Kansas",
//     city: "Drytown",
//     last_visit: "2017-07-05 08:46",
//     days: 52,
//     visible: false,
//     checked: false
//   },
//   {
//     key: 12,
//     id: "5993f8c870241a7352ccfdb7",
//     index: 1,
//     name: "Owens Case",
//     code: "P604434",
//     subregion: "Connecticut",
//     city: "Gorst",
//     last_visit: "2017-06-06 04:20",
//     days: 34,
//     visible: false,
//     checked: false
//   },
//   {
//     key: 13,
//     id: "5993f8c8729a8fe6f1289b62",
//     index: 2,
//     name: "Katie Tillman",
//     code: "P699230",
//     subregion: "Vermont",
//     city: "Welch",
//     last_visit: "2017-04-14 11:33",
//     days: 3,
//     visible: false,
//     checked: false
//   },
//   {
//     key: 14,
//     id: "5993f8c83721c7d6feca41a7",
//     index: 3,
//     name: "Shelton Dorsey",
//     code: "P744243",
//     subregion: "Tennessee",
//     city: "Grill",
//     last_visit: "2017-03-04 09:31",
//     days: 26,
//     visible: false,
//     checked: true
//   },
//   {
//     key: 15,
//     id: "5993f8c812288395c1cd631f",
//     index: 4,
//     name: "Lucille Sears",
//     code: "P931939",
//     subregion: "Arkansas",
//     city: "Lewis",
//     last_visit: "2017-01-27 03:28",
//     days: 90,
//     visible: false,
//     checked: true
//   },
//   {
//     key: 16,
//     id: "5993f8c82c51463dbb77022c",
//     index: 5,
//     name: "Mckay Leonard",
//     code: "P340714",
//     subregion: "South Carolina",
//     city: "Brecon",
//     last_visit: "2017-05-12 08:36",
//     days: 22,
//     visible: false,
//     checked: false
//   },
//   {
//     key: 111,
//     id: "5993f8c8891124f2a474176f",
//     index: 0,
//     name: "Marisa Mullen",
//     code: "P343545",
//     subregion: "Kansas",
//     city: "Drytown",
//     last_visit: "2017-07-05 08:46",
//     days: 52,
//     visible: false,
//     checked: false
//   },
//   {
//     key: 121,
//     id: "5993f8c870241a7352ccfdb7",
//     index: 1,
//     name: "Owens Case",
//     code: "P604434",
//     subregion: "Connecticut",
//     city: "Gorst",
//     last_visit: "2017-06-06 04:20",
//     days: 34,
//     visible: false,
//     checked: false
//   },
//   {
//     key: 131,
//     id: "5993f8c8729a8fe6f1289b62",
//     index: 2,
//     name: "Katie Tillman",
//     code: "P699230",
//     subregion: "Vermont",
//     city: "Welch",
//     last_visit: "2017-04-14 11:33",
//     days: 3,
//     visible: false,
//     checked: false
//   },
//   {
//     key: 141,
//     id: "5993f8c83721c7d6feca41a7",
//     index: 3,
//     name: "Shelton Dorsey",
//     code: "P744243",
//     subregion: "Tennessee",
//     city: "Grill",
//     last_visit: "2017-03-04 09:31",
//     days: 26,
//     visible: false,
//     checked: true
//   },
//   {
//     key: 151,
//     id: "5993f8c812288395c1cd631f",
//     index: 4,
//     name: "Lucille Sears",
//     code: "P931939",
//     subregion: "Arkansas",
//     city: "Lewis",
//     last_visit: "2017-01-27 03:28",
//     days: 90,
//     visible: false,
//     checked: true
//   },
//   {
//     key: 161,
//     id: "5993f8c82c51463dbb77022c",
//     index: 5,
//     name: "Mckay Leonard",
//     code: "P340714",
//     subregion: "South Carolina",
//     city: "Brecon",
//     last_visit: "2017-05-12 08:36",
//     days: 22,
//     visible: false,
//     checked: false
//   },
//   {
//     key: 1111,
//     id: "5993f8c8891124f2a474176f",
//     index: 0,
//     name: "Marisa Mullen",
//     code: "P343545",
//     subregion: "Kansas",
//     city: "Drytown",
//     last_visit: "2017-07-05 08:46",
//     days: 52,
//     visible: false,
//     checked: false
//   },
//   {
//     key: 1211,
//     id: "5993f8c870241a7352ccfdb7",
//     index: 1,
//     name: "Owens Case",
//     code: "P604434",
//     subregion: "Connecticut",
//     city: "Gorst",
//     last_visit: "2017-06-06 04:20",
//     days: 34,
//     visible: false,
//     checked: false
//   },
//   {
//     key: 1311,
//     id: "5993f8c8729a8fe6f1289b62",
//     index: 2,
//     name: "Katie Tillman",
//     code: "P699230",
//     subregion: "Vermont",
//     city: "Welch",
//     last_visit: "2017-04-14 11:33",
//     days: 3,
//     visible: false,
//     checked: false
//   },
//   {
//     key: 1411,
//     id: "5993f8c83721c7d6feca41a7",
//     index: 3,
//     name: "Shelton Dorsey",
//     code: "P744243",
//     subregion: "Tennessee",
//     city: "Grill",
//     last_visit: "2017-03-04 09:31",
//     days: 26,
//     visible: false,
//     checked: true
//   },
//   {
//     key: 1511,
//     id: "5993f8c812288395c1cd631f",
//     index: 4,
//     name: "Lucille Sears",
//     code: "P931939",
//     subregion: "Arkansas",
//     city: "Lewis",
//     last_visit: "2017-01-27 03:28",
//     days: 90,
//     visible: false,
//     checked: true
//   },
//   {
//     key: 1611,
//     id: "5993f8c82c51463dbb77022c",
//     index: 5,
//     name: "Mckay Leonard",
//     code: "P340714",
//     subregion: "South Carolina",
//     city: "Brecon",
//     last_visit: "2017-05-12 08:36",
//     days: 22,
//     visible: false,
//     checked: false
//   }
// ];

import React, {Component} from "react";
import {
  Text,
  View,
  FlatList,
  Dimensions,
  Button,
  StyleSheet
} from "react-native";

const {width} = Dimensions.get("window");

const style = {
  justifyContent: "center",
  alignItems: "center",
  width: width,
  height: 50,
  flex: 1,
  borderWidth: 1
};

const COLORS = ["deepskyblue", "fuchsia", "lightblue "];

function getData(number) {
  let data = [];
  for (var i = 0; i < number; ++i) {
    data.push("" + i);
  }

  return data;
}

class ScrollToExample extends Component {
  state = {
    sc: 0.5
  };
  getItemLayout = (data, index) => ({length: 50, offset: 50 * index, index});

  getColor(index) {
    const mod = index % 3;
    return COLORS[mod];
  }

  scrollToIndex = ind => {
    // this.flatListRef.scrollToIndex({animated: true, index: ind});
    // this.flatListRef2.scrollToIndex({animated: true, index: ind});
  };

  scrollToItem = () => {
    let randomIndex = Math.floor(
      Math.random(Date.now()) * this.props.data.length
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Button
            onPress={this.scrollToIndex}
            title="Tap to scrollToIndex"
            color="darkblue"
          />
          <Button
            onPress={this.scrollToItem}
            title="Tap to scrollToItem"
            color="purple"
          />
        </View>
        <View style={{flexDirection: "row"}}>
          <FlatList
            style={{flex: 1}}
            ref={ref => {
              this.flatListRef = ref;
            }}
            keyExtractor={item => item}
            getItemLayout={this.getItemLayout}
            //initialScrollIndex={50}
            // initialNumToRender={2}
            renderItem={({item, index}) => (
              <View style={{...style, backgroundColor: this.getColor(index)}}>
                <Text>{item}</Text>
              </View>
            )}
            bounces={false}
            {...this.props}
            onScroll={event => {
              let yOffset = event.nativeEvent.contentOffset.y;
              let contentHeight = event.nativeEvent.contentSize.height;
              let value = yOffset / contentHeight;
              //this.scrollToIndex(value);
              //this.setState({sc: value});
              this.flatListRef2.scrollToIndex({animated: true, index: 0.5});
              console.log(value);
            }}
          />
          <FlatList
            style={{flex: 1}}
            ref={ref => {
              this.flatListRef2 = ref;
            }}
            keyExtractor={item => item}
            bounces={false}
            getItemLayout={this.getItemLayout}
            //initialScrollIndex={this.state.sc}
            // initialNumToRender={2}
            renderItem={({item, index}) => (
              <View style={{...style, backgroundColor: this.getColor(index)}}>
                <Text>{item}</Text>
              </View>
            )}
            {...this.props}
            onScroll={event => {
              let yOffset = event.nativeEvent.contentOffset.y;
              let contentHeight = event.nativeEvent.contentSize.height;
              let value = yOffset / contentHeight;
              // this.scrollToIndex(value);
              //this.flatListRef.scrollToIndex({animated: true, index: value});
              console.log(value);
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingTop: 20,
    backgroundColor: "darkturquoise",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default class app extends Component {
  render() {
    return <ScrollToExample data={getData(100)} />;
  }
}
