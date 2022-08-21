import React from "react";
import {Text, View, Modal, Image, Animated, StyleSheet} from "react-native";
import {Searchbar, TextInput} from "react-native-paper";
import StickyParallaxHeader from "react-native-sticky-parallax-header";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import {FloatingAction} from "react-native-floating-action";
import {Ionicons} from "react-native-vector-icons";
import ActionSheet from "react-native-actionsheet";
const types = ["Argent", "Vehicule", "Autres", "Cancel"];
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
  constructor(props) {
    super(props);
    this.state = {
      scroll: new Animated.Value(0),
      firstQuery: "",
      viewContact: true,
      visible: false,
      type: "Argent",
    };
  }

  componentDidMount() {
    const {scroll} = this.state;
    scroll.addListener(({value}) => (this._value = value));
  }
  showTypeBet = () => {
    this.typeModal.show();
  };
  _showModal = () => this.setState({visible: true});
  _hideModal = () => this.setState({visible: false});

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
        {this.state.viewContact == true ? (
          <View style={{flex: 1}}>
            <View style={{paddingTop: 30, backgroundColor: "#2E4053"}}>
              <Searchbar
                placeholder="Search"
                placeholderTextColor={"#000"}
                style={{
                  borderBottomColor: "#000",
                  borderBottomWidth: 2,
                }}
                onChangeText={(query) => {
                  this.setState({firstQuery: query});
                }}
                value={firstQuery}
              />
            </View>
            <ScrollView style={{}}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(() => (
                <TouchableOpacity
                  onPress={() => this.setState({viewContact: false})}
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
                        fontSize: 20,
                        fontWeight: "600",
                        color: "#000",
                      }}>
                      John Bob Legran
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        marginTop: 10,
                        fontWeight: "600",
                        color: "#aaa",
                      }}>
                      Score: 5.7
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
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
                    <TouchableOpacity
                      onPress={() => this.setState({viewContact: true})}
                      style={{
                        width: 150,

                        borderRadius: 10,
                        alignSelf: "flex-end",
                        justifyContent: "center",
                        alignItems: "center",
                      }}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: "900",
                          color: "#aaa",
                          alignSelf: "center",
                        }}>
                        Changer
                      </Text>
                    </TouchableOpacity>
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
                <TouchableOpacity
                  style={{
                    height: 35,
                    width: 150,
                    marginRight: 20,
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    alignSelf: "flex-end",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text
                    style={{fontSize: 17, fontWeight: "900", color: "#000"}}>
                    Envoyer
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            <TouchableOpacity
              onPress={this.showTypeBet}
              style={{
                marginVertical: 5,
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
                {this.state.type}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this._showModal}
              style={{
                height: 150,
                marginVertical: 5,
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
            </TouchableOpacity>
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
        )}

        <ActionSheet
          ref={(o) => (this.typeModal = o)}
          title={"Type de demande"}
          options={types}
          cancelButtonIndex={types.length - 1}
          onPress={(index) => {
            if (index !== types.length - 1) this.setState({type: types[index]});
          }}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.visible}
          onDismiss={this._hideModal}
          style={{backgroundColor: "transparent"}}>
          <View
            style={{
              width: "100%",
              flex: 1,
              backgroundColor: "#000",
              paddingTop: 30,
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "#fff",
                borderBottomWidth: 0,
                height: 40,
              }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: "bold",
                  paddingTop: 20,
                }}>
                {""}
              </Text>
              <Text
                style={{
                  marginBottom: 0,
                  color: "#fff",
                  paddingTop: 20,
                }}
                onPress={this._hideModal}>
                Close
              </Text>
            </View>

            <TextInput
              style={{height: 200, width: "100%"}}
              multiline
              autoFocus={true}
              textAlign="justify"
              underlineColorAndroid="transparent"
              placeholderTextColor="#D50000"
            />
          </View>
        </Modal>
      </View>
    );
  }
}
