import React, {Component} from "react";
import {View, TouchableOpacity, ScrollView, Text} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import {Ionicons} from "react-native-vector-icons";
import {noir, jaune, gris} from "../styles/colors";
import {KEYAPI, SERVER} from "../redux/actionTypes";
import axios from "axios";
import {connect} from "react-redux";
import {updateUserInfo} from "../redux/actions/user";

class BowlSeason extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    const self = this;
    if (
      this.props.user &&
      this.props.user.bowlGames &&
      this.props.user.bowlGames.length > 0
    ) {
      this.setState({data: this.props.user.bowlGames});
    } else {
      axios
        .get(`${SERVER}/bowl-games`, {
          headers: {
            Authorization: `Bearer ${this.props.token}`,
          },
        })
        .then(function (response) {
          // handle success
          console.log(JSON.stringify(response.data, null, 2));
          self.setState({data: response.data});
        })
        .catch(function (error) {
          // handle error
          console.log(JSON.stringify(error));
          //dispatch({type: SET_USER, user: user});
        });
    }
  }
  switchGameOrder = (index, move) => {
    if (move == "up" && index - 1 >= 0) {
      const moveTo = -1;
      const tmp = this.state.data[index + moveTo];
      this.state.data[index + moveTo] = this.state.data[index];
      this.state.data[index] = tmp;

      this.setState({...this.state.data}, () => {
        this.props.updateUserInfo(
          {bowlGames: this.state.data},
          this.props.user.id,
          this.props.token
        );
      });
    } else if (move == "down" && index + 1 < this.state.data.length) {
      const moveTo = 1;
      const tmp = this.state.data[index + moveTo];
      this.state.data[index + moveTo] = this.state.data[index];
      this.state.data[index] = tmp;

      this.setState({...this.state.data}, () => {
        this.props.updateUserInfo(
          {bowlGames: this.state.data},
          this.props.user.id,
          this.props.token
        );
      });
    }
  };
  render() {
    return (
      <View style={{flex: 1, width: "100%", marginTop: -20}}>
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              backgroundColor: noir,
              paddingVertical: 50,
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Text
              style={{
                color: "#edd798",
                fontFamily: "Monda",
                fontSize: 39,
                fontWeight: "400",
                lineHeight: 45,
                textAlign: "center",
              }}>
              {"Start by ordering"}
            </Text>
            <Text
              style={{
                color: "#edd798",
                fontFamily: "Monda",
                fontSize: 39,
                fontWeight: "400",
                lineHeight: 45,
                textAlign: "center",
              }}>
              {"the games from"}
            </Text>
            <Text
              style={{
                color: "#edd798",
                fontFamily: "Monda",
                fontSize: 39,
                fontWeight: "400",
                lineHeight: 45,
                textAlign: "center",
              }}>
              {"1 to 38"}
            </Text>
          </View>

          <Text
            style={{
              color: "#edd798",
              fontFamily: "Monda",
              fontSize: 16,
              fontWeight: "400",
              lineHeight: 22,
              textAlign: "center",
              padding: 20,
              marginVertical: 20,
            }}>
            {
              "Remember, your “38” game is worth 38 points and your “1” game is worth 1 point. Your “15” game is worth 15 points, and so on and so forth. Simply drag the game to the position you want them."
            }
          </Text>

          {this.state.data.map((item, index) => {
            if (index < 38)
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      marginHorizontal: index + 1 >= 10 ? 10 : 15,
                      alignSelf: "center",
                      fontWeight: "600",
                      fontFamily: "Monda",
                      color: jaune,
                      fontSize: 16,
                    }}>
                    {index + 1}
                  </Text>
                  <View
                    style={{
                      height: 70,
                      flex: 1,
                      marginHorizontal: 15,
                      backgroundColor: noir,
                      paddingHorizontal: 20,
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                    onPress={() => {}}>
                    <Text
                      style={{
                        fontWeight: "400",
                        color: jaune,
                        fontSize: 14,
                      }}>
                      {item.team1 + " - " + item.team2}
                    </Text>
                    <View>
                      <TouchableOpacity
                        style={{padding: 5}}
                        onPress={() => {
                          this.switchGameOrder(index, "up");
                        }}>
                        <Ionicons
                          name={"ios-arrow-up"}
                          color={jaune}
                          size={20}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{padding: 5}}
                        onPress={() => {
                          this.switchGameOrder(index, "down");
                        }}>
                        <Ionicons
                          name={"ios-arrow-down"}
                          color={jaune}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
          })}

          <View
            style={{
              backgroundColor: noir,
              paddingVertical: 50,
              justifyContent: "center",
              alignItems: "center",
              margin: 15,
            }}>
            <Text
              style={{
                color: "#edd798",
                fontFamily: "Monda",
                fontSize: 39,
                fontWeight: "400",
                lineHeight: 45,
                textAlign: "center",
              }}>
              {"All Set? \nDon’t Forget \nto Make \nYour Picks."}
            </Text>

            <TouchableOpacity
              style={{
                width: 155,
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: jaune,
                marginTop: 40,
              }}>
              <Text
                style={{
                  color: noir,
                  fontFamily: "monda",
                  fontSize: 12,
                  fontWeight: "700",
                }}>
                MAKE YOUR PICKS
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: "#585858",
              fontFamily: "Arial",
              fontSize: 10,
              fontWeight: "700",
              alignSelf: "center",
              marginVertical: 50,
            }}>
            FOR THE GOOD OF THE LEAGUE
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {user, token} = state.user;
  return {
    user,
    token,
  };
};

export default connect(mapStateToProps, {updateUserInfo})(BowlSeason);
