import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  Touchable,
  Alert
} from "react-native";
import ImagePicker from "react-native-image-picker";
import { Ionicons } from "react-native-vector-icons";
import { connect } from "react-redux";
import {
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} from "@env"

import { SERVER } from "../redux/actionTypes";

import axios from "axios";

import {
  logoutUser,
  updateUserInfo,
  getConferences,
} from "../redux/actions/user";
import { jaune, noir, gris } from "../styles/colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../utils/variables";
import { TouchableOpacity } from "react-native-gesture-handler";

import ActionSheet from "react-native-actionsheet";


const options = {
  title: "Select Avatar",
  customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
  storageOptions: {
    skipBackup: true,
    path: "images",
  },
};

import { init, UploadImage } from "../utils/functions";

init(CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME);

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      passwordC: "",
      visible: false,
      imageLoading: false,
      avatarSource:
        this.props.user.avatar && this.props.user.avatar.url
          ? { uri: this.props.user.avatar.url }
          : null,
      conference:
        this.props.user && this.props.user.conference
          ? this.props.user.conference
          : {},
    };
    this.props.getConferences();
  }
  _showModal = () => this.setState({ visible: true });
  _hideModal = () => this.setState({ visible: false });
  getImage = () => { };
  render() {
    return (
      <View style={{ backgroundColor: noir, flex: 1 }}>

        {/* <Modal
          animationType="slide"
          transparent={false}
          visible={true}
          onRequestClose={() => {
            this._hideModal();
          }}
        >
          <View style={{ alignSelf: "center", padding: 10, marginTop: 70, height: 300, width: "80%", borderRadius: 10, backgroundColor: noir }}>

            <TouchableOpacity style={{
              // padding: 20, position: "absolute", top: 50, left: 30,
              //zIndex: 999999
              // position: "relative", top: 50, left: 30
            }}>
              <Text style={{ backgroundColor: "blue", color: "red", padding: 0 }} onPress={() => alert("dddd")} >Close</Text>
            </TouchableOpacity>

          </View>
        </Modal> */}
        <ImageBackground
          source={require("../images/profileBack.png")}
          style={{
            height: SCREEN_HEIGHT / 4.5,
            backgroundColor: "#eee",
            alignItems: "center",
            paddingTop: 10,
          }}
          resizeMode={"cover"}>

          <TouchableOpacity
            onPress={() => {
              let self = this;

              ImagePicker.showImagePicker(options, (response) => {
                this.setState({ imageLoading: true });
                if (response.didCancel) {
                  console.log("User cancelled image picker");
                } else if (response.error) {
                  console.log("ImagePicker Error: ", response.error);
                } else if (response.customButton) {
                  console.log(
                    "User tapped custom button: ",
                    response.customButton
                  );
                } else {
                  const source = { uri: response.uri };

                  self.setState(
                    {
                      avatarSource: source,
                    },
                    () => {
                      UploadImage(response.uri)
                        .then((res) => {
                          this.setState({ imageLoading: false });
                          console.log("Has been upload");

                          self.props.updateUserInfo(
                            { avatar: res },
                            self.props.user._id,
                            self.props.token
                          );
                        })
                        .catch(() => {
                          this.setState({ imageLoading: false });
                          console.log(JSON.stringify("error, not been upload"));
                        });
                    }
                  );
                }
              });
            }}
            style={{
              width: SCREEN_WIDTH / 4,
              height: SCREEN_WIDTH / 4,
              borderRadius: SCREEN_WIDTH / 6,
              borderColor: "#edd798",
              borderStyle: "solid",
              borderWidth: 3,
              backgroundColor: "#edd798",
              backgroundColor: jaune,
              justifyContent: "center",
              alignItems: "center",
            }}>
            <ImageBackground
              borderRadius={SCREEN_WIDTH / 6}
              style={{
                width: SCREEN_WIDTH / 4,
                height: SCREEN_WIDTH / 4,
                borderRadius: SCREEN_WIDTH / 6,
                alignItems: "center",
                justifyContent: "center",
              }}
              source={
                this.state.avatarSource !== null
                  ? this.state.avatarSource
                  : null
              }>
              {this.state.imageLoading === false &&
                this.state.avatarSource == null ? (
                  <Image
                    source={require("../images/addImage.png")}
                    style={{
                      width: 43,
                      height: 37,
                    }}
                  />
                ) : null}

              {this.state.imageLoading === true ? (
                <ActivityIndicator color={"#fff"} />
              ) : null}

              <View
                style={{
                  width: SCREEN_WIDTH / 4,
                  height: SCREEN_WIDTH / 4,
                  borderRadius: SCREEN_WIDTH / 6,
                  backgroundColor: "#000",
                  opacity: 0.3,
                  position: "absolute",
                }}
              />
            </ImageBackground>
          </TouchableOpacity>
          <Text
            style={{
              height: 24,
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 20,
              fontWeight: "700",
              lineHeight: 24,
            }}>
            {this.props.user.fullname}
          </Text>
          <Text
            style={{
              height: 24,
              color: "#edd798",
              fontFamily: "Arial",
              fontSize: 10,
              fontWeight: "400",
              lineHeight: 24,
            }}>
            {`${this.props.user.city}, ${this.props.user.state} `}
          </Text>
        </ImageBackground>
        <ScrollView>

          <Input
            label={"Full name"}
            text={this.props.user.fullname}
            onSave={(data) => {
              this.props.updateUserInfo(
                data,
                this.props.user.id,
                this.props.token
              );
            }}
            edit={false}
            editable={true}
          />
          <Input
            label={"User name"}
            text={this.props.user.username}
            onSave={(data) => {
              this.props.updateUserInfo(
                data,
                this.props.user._id,
                this.props.token
              );
            }}
            edit={false}
            editable={false}
          />
          <Input
            label={"Email"}
            text={this.props.user.email}
            onSave={(data) => {
              this.props.updateUserInfo(
                data,
                this.props.user._id,
                this.props.token
              );
            }}
            edit={false}
            editable={true}
          />
          <Input
            label={"City"}
            text={this.props.user.city}
            onSave={(data) => {
              this.props.updateUserInfo(
                data,
                this.props.user.id,
                this.props.token
              );
            }}
            edit={false}
            editable={true}
          />

          <Input
            label={"State"}
            text={this.props.user.state}
            onSave={(data) => {
              this.props.updateUserInfo(
                data,
                this.props.user.id,
                this.props.token
              );
            }}
            edit={false}
            editable={true}
          />

          <TouchableOpacity
            onPress={() => {
              this.selectedConference.show();
            }}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 50,
              width: "100%",
              backgroundColor: gris,
              alignItems: "center",
              paddingHorizontal: 20,
              marginTop: 0,
            }}>
            <Text
              style={{
                color: jaune,
                fontSize: 15,
                fontFamily: "monda",
                fontWeight: "400",
                width: "90%",
              }}>
              {`Change your Power Division ${this.state.conference && this.state.conference.conferenceName ? `( ${this.state.conference.conferenceName} )` : "__"}`}
            </Text>
            <Ionicons name={"ios-arrow-down"} color={jaune} size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this._showModal()}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              height: 50,
              width: "100%",
              backgroundColor: gris,
              alignItems: "center",
              paddingHorizontal: 20,
              marginTop: 10,
            }}>
            <Text
              style={{
                color: jaune,
                fontSize: 15,
                fontFamily: "monda",
                fontWeight: "400",
                width: "90%",
              }}>
              {`Change your password`}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 150 }}></View>




        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => {
            this._hideModal()
          }}
        >
          <View style={{ alignSelf: "center", padding: 10, marginTop: 70, height: 300, width: "80%", borderRadius: 10, backgroundColor: "#fff" }}>

            <TouchableOpacity onPress={this._hideModal} style={{ padding: 20, alignSelf: "flex-end" }}>
              <Text style={{ color: "red" }} onPress={this._hideModal}>Close</Text>

            </TouchableOpacity>

            <View
              style={{

                width: "100%",
                backgroundColor: gris,
                marginBottom: 10,
                paddingVertical: 10,
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 10,
                flexDirection: "row",
              }}>
              <Text
                style={{
                  width: "25%",
                  color: jaune,
                  fontFamily: "Arial",
                  fontSize: 10,
                  fontWeight: "400",
                }}>
                {"Password"}
              </Text>
              <TextInput
                autoCorrect={false}
                autoCapitalize={"none"}
                secureTextEntry={true}
                style={{
                  color: gris,
                  width: "75%",
                  backgroundColor: jaune,
                  height: 40,
                  fontSize: 15,
                  paddingHorizontal: 10,
                  textAlign: "left"
                }}
                value={this.state.password}
                onChangeText={(password) => this.setState({ password: password })}
              />
            </View>
            <View
              style={{
                width: "100%",
                backgroundColor: gris,
                marginBottom: 10,
                paddingVertical: 10,
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 10,
                flexDirection: "row",
              }}>
              <Text
                style={{
                  width: "25%",
                  color: jaune,
                  fontFamily: "Arial",
                  fontSize: 10,
                  fontWeight: "400",
                }}>
                {"Confirmation"}
              </Text>
              <TextInput

                autoCorrect={false}
                autoCapitalize={"none"}
                secureTextEntry={true}
                style={{
                  color: gris,
                  width: "75%",
                  backgroundColor: jaune,
                  height: 40,
                  fontSize: 15,
                  paddingHorizontal: 10,
                  textAlign: "left"
                }}
                value={this.state.passwordC}
                onChangeText={(passwordC) => this.setState({ passwordC: passwordC })}
              />
            </View>
            {this.state.password && this.state.passwordC && this.state.password === this.state.passwordC ? <TouchableOpacity
              style={{
                width: "80%",
                backgroundColor: gris,
                marginBottom: 10,
                paddingVertical: 10,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center"
              }}

            >
              <Text
                onPress={() => {
                  let self = this;
                  axios
                    .put(`${SERVER}/users/${this.props.user.id}`, { password: this.state.password }, {
                      headers: {
                        Authorization: `Bearer ${this.props.token}`,
                      },
                    })
                    .then(function (response) {
                      //
                      if (response.data && response.data._id) {
                        self._hideModal();
                        //alert(JSON.stringify(response.data));
                      }
                    })
                    .catch(function (error) {
                      Alert.alert("Change password", "Your password has not been changed");
                      //alert(JSON.stringify(error.message))
                      console.log(JSON.stringify(error.message));
                    });



                }} style={{
                  color: jaune,
                  fontFamily: "Arial",
                  fontSize: 17,
                  fontWeight: "400",
                }}>{"Change password"}</Text>
            </TouchableOpacity> : null}

            {this.state.password && this.state.passwordC && this.state.password !== this.state.passwordC ? <Text style={{ fontSize: 12, color: jaune, alignSelf: "center" }}>Passwords are not match</Text> : null}

          </View>

        </Modal>


        <ActionSheet
          ref={(o) => (this.selectedConference = o)}
          title={"PICK YOUR POWER DIVISION"}
          options={this.props.conferences
            .map((i) => i.conferenceName)
            .concat(["Cancel"])}
          cancelButtonIndex={this.props.conferences
            .map((i) => i.conferenceName)
            .concat(["Cancel"]).length - 1}
          // destructiveButtonIndex={1}
          onPress={(index) => {
            if (index !== this.props.conferences
              .map((i) => i.conferenceName)
              .concat(["Cancel"]).length - 1)
              this.setState(
                {
                  conference: this.props.conferences[index],
                },
                () => {

                  this.props.updateUserInfo(
                    { conference: this.state.conference._id },
                    this.props.user.id,
                    this.props.token
                  );

                }
              );
          }}
        />
      </View>
    );
  }
}

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = { text: this.props.text, edit: this.props.edit };
  }

  render() {
    const { label, editable } = this.props;
    return (
      <View
        style={{
          width: SCREEN_WIDTH,
          backgroundColor: this.state.edit ? jaune : gris,
          marginBottom: 10,
          paddingVertical: 10,
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
          flexDirection: "row",
        }}>
        <Text
          style={{
            width: "20%",
            color: !this.state.edit ? jaune : gris,
            fontFamily: "Arial",
            fontSize: 12,
            fontWeight: "400",
          }}>
          {label}
        </Text>
        <TextInput
          placeholderTextColor={jaune}
          keyboardType={"email-address"}
          autoCapitalize={"none"}
          autoCorrect={false}
          editable={this.state.edit}
          style={{
            color: !this.state.edit ? jaune : gris,
            width: "60%",
            backgroundColor: this.state.edit ? jaune : gris,
            height: 40,
            fontSize: 14,
            fontWeight: "bold",
            paddingHorizontal: 10,
          }}
          value={this.state.text}
          onChangeText={(text2) => this.setState({ text: text2 })}
        />
        {!this.state.edit ? (
          <View
            style={{
              width: "20%",
              paddingLeft: 10,
              alignItems: "flex-end",
            }}>
            {editable ? (
              <Ionicons
                onPress={() => this.setState({ edit: true })}
                size={30}
                name={this.state.edit ? "ios-save" : "ios-create"}
                color={jaune}
              />
            ) : null}
          </View>
        ) : (
            <TouchableOpacity
              onPress={() => {
                let query =
                  label === "Full name"
                    ? { fullname: this.state.text }
                    : label === "City"
                      ? { city: this.state.text }
                      : label === "Email"
                        ? { email: this.state.text }
                        : { state: this.state.text };
                this.props.onSave(query);
                this.setState({ edit: false });
              }}
              style={{
                height: 32,
                backgroundColor: "#282828",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Text
                style={{
                  color: "#edd798",
                  fontFamily: "Arial",
                  fontSize: 14,
                  paddingHorizontal: 20,
                  fontWeight: "700",
                }}>
                SAVE
            </Text>
            </TouchableOpacity>
          )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { user, logged, token, conferences } = state.user;
  return { user, logged, token, conferences };
};
export default connect(mapStateToProps, {
  logoutUser,
  updateUserInfo,
  getConferences,
})(Profile);
