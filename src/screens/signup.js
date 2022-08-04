import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Snackbar } from "react-native-paper";
import { jaune, noir, gris } from "../styles/colors";
import { FontAwesome5, Ionicons } from "react-native-vector-icons";
import { Formik } from "formik";
import * as yup from "yup";
import { connect } from "react-redux";
import { createUser, setUserStatus, getGroups } from "../redux/actions/user";
import { SERVER } from '../redux/actionTypes'
import axios from 'axios'
const validationSchema = yup.object().shape({
  fullname: yup.string().required().label("Full name"),
  email: yup.string().required().email().label("Email"),
  city: yup.string().required().label("City"),
  state: yup.string().required().label("State"),
  username: yup.string().required().label("Username").min(4).max(12),
  password: yup.string().required().label("Password"),
  passwordConf: yup.string().required().label("Password conf."),
});

class signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: "",
      email: "",
      bdr: 1,
      visible: false,
      snackbarText: "",
      loading: false,
    };
    this.props.getGroups();
    this.affectedGroup = {};
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.statusUser !== this.props.statusUser &&
      this.props.statusUser === "STARTED_CREATE"
    ) {
      this.props.setUserStatus("");
      this.setState({ loading: true });
    } else if (this.props.statusUser == "FAILLED_CREATE") {
      this.props.setUserStatus("");
      this.setState({
        loading: false,
        visible: true,
        snackbarText: "User has not been create.",
      });
    } else if (this.props.statusUser == "SUCCESSED_CREATE") {
      this.props.setUserStatus("");
      this.setState(
        {
          loading: false,
        },
        () => {
          this.props.navigation.navigate("Signin");
        }
      );
    }
  }
  componentDidMount() {





  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={gris} barStyle="light-content" />

        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={styles.container}>
          {this.state.loading === true ? (
            <Image
              source={require("../images/loading.gif")}
              style={{
                width: 40,
                height: 40,
                position: "absolute",
                alignSelf: "center",
                marginTop: 680,
                zIndex: 999,
              }}
            />
          ) : null}
          <Formik
            enableReinitialize
            initialValues={
              {
                // fullname: "Sauvenel Beaudry",
                // email: "sauvenel2013@gmail.com",
                // city: "NY",
                // state: "NY",
                // username: "sauvenel2013",
                // password: "qwerty",
                // passwordConf: "qwerty",
              }
            }
            onSubmit={(values) => {


              let self = this;

              axios
                .get(`${SERVER}/groups`)
                .then(function (response) {

                  let lastGroup = response.data.map(a => { return { id: a.id, name: a.name, usersCount: a.users.length } }).sort(function (a, b) { return b.usersCount - b.usersCount });

                  for (let index = 0; index < lastGroup.length; index++) {
                    const element = lastGroup[index];

                    if (element.usersCount === 0) {
                      if (index === 0) {
                        self.affectedGroup = element;
                      } else if (lastGroup[index - 1].usersCount < 20) {
                        self.affectedGroup = lastGroup[index - 1];
                      } else {
                        self.affectedGroup = element;
                      }


                      values.group = self.affectedGroup.id;
                      if (values.password !== values.passwordConf) {
                        self.setState({
                          visible: true,
                          snackbarText: "Password are not match",
                        });
                      } else {
                        self.props.createUser(values);
                      }

                      break;
                    }



                  }

                })
                .catch(function (error) {

                  // handle error
                  console.log(JSON.stringify(error.message));
                  //dispatch({type: SET_USER, user: user});
                });









            }}
            validationSchema={validationSchema}>
            {(formikProps) => (
              <ScrollView>
                <Text
                  style={{
                    alignSelf: "center",
                    fontSize: 30,
                    marginBottom: 30,
                    marginTop: 20,
                    color: "#edd798",
                    fontFamily: "Arial",
                    fontSize: 20,
                    fontWeight: "700",
                    lineHeight: 30,
                  }}>
                  Create an Account
                </Text>
                <View>
                  <TextInput
                    returnKeyType={"next"}
                    placeholder={"Full name"}
                    placeholderTextColor={jaune}
                    style={{
                      color: jaune,
                      marginHorizontal: 10,
                      marginBottom: 5,
                      marginTop: 20,
                      backgroundColor: noir,
                      height: 48,
                      borderColor: jaune,
                      borderStyle: "solid",
                      borderWidth: 2,
                      backgroundColor: gris,
                      paddingRight: 10,
                      paddingLeft: 10,
                    }}
                    mode="outlined"
                    value={formikProps.values.fullname}
                    onChangeText={formikProps.handleChange("fullname")}
                    onSubmitEditing={() => {
                      this.email.focus();
                    }}
                    blurOnSubmit={false}
                  />
                  {/* <Text
                    style={{
                      width: 80,

                      position: "absolute",
                      textAlign: "left",
                      left: 20,
                      bottom: 20,
                      color: jaune,
                    }}>
                    Full Name
                  </Text> */}
                  <Text
                    style={{
                      position: "absolute",
                      bottom: -8,
                      color: "red",
                      fontSize: 10,
                      marginHorizontal: 20,
                    }}>
                    {formikProps.errors.fullname}
                  </Text>
                </View>
                <View>
                  <TextInput
                    returnKeyType={"next"}
                    placeholderTextColor={jaune}
                    keyboardType={"email-address"}
                    autoCapitalize={"none"}
                    placeholder={"Email"}
                    placeholderTextColor={jaune}
                    ref={(input) => {
                      this.email = input;
                    }}
                    style={{
                      color: jaune,
                      marginHorizontal: 10,
                      marginBottom: 5,

                      marginTop: 20,
                      backgroundColor: noir,
                      height: 48,
                      borderColor: jaune,
                      borderStyle: "solid",
                      borderWidth: 2,
                      backgroundColor: gris,
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                    value={formikProps.values.email}
                    onChangeText={formikProps.handleChange("email")}
                    onSubmitEditing={() => {
                      this.city.focus();
                    }}
                  />
                  {/* <Text
                    style={{
                      width: 80,

                      position: "absolute",
                      textAlign: "left",
                      left: 20,
                      bottom: 20,
                      color: jaune,
                    }}>
                    Email
                  </Text> */}
                  <Text
                    style={{
                      position: "absolute",
                      bottom: -8,
                      color: "red",
                      fontSize: 10,
                      marginHorizontal: 20,
                    }}>
                    {formikProps.errors.email}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", marginHorizontal: 0 }}>
                  <View
                    style={{
                      width: "52%",
                      marginRight: "5%",
                    }}>
                    <TextInput
                      returnKeyType={"next"}
                      ref={(input) => {
                        this.city = input;
                      }}
                      placeholder={"City"}
                      placeholderTextColor={jaune}
                      style={{
                        width: "100%",
                        color: jaune,
                        marginHorizontal: 10,
                        marginBottom: 5,
                        marginTop: 20,
                        backgroundColor: noir,
                        height: 48,
                        borderColor: jaune,
                        borderStyle: "solid",
                        borderWidth: 2,
                        backgroundColor: gris,
                        paddingLeft: 10,
                        paddingRight: 10,
                      }}
                      value={formikProps.values.city}
                      onChangeText={formikProps.handleChange("city")}
                      onSubmitEditing={() => {
                        this.state.focus();
                      }}
                    />
                    {/* <Text
                      style={{
                        width: 80,

                        position: "absolute",
                        textAlign: "left",
                        left: 20,
                        bottom: 20,
                        color: jaune,
                      }}>
                      City
                    </Text> */}
                    <Text
                      style={{
                        position: "absolute",
                        bottom: -8,
                        color: "red",
                        fontSize: 10,
                        marginHorizontal: 10,
                      }}>
                      {formikProps.errors.city}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginLeft: "5%",
                      width: "35%",
                    }}>
                    <TextInput
                      returnKeyType={"next"}
                      ref={(input) => {
                        this.state = input;
                      }}
                      placeholder={"State"}
                      placeholderTextColor={jaune}
                      style={{
                        marginBottom: 5,
                        width: "100%",
                        color: jaune,
                        marginBottom: 5,
                        marginTop: 20,
                        backgroundColor: noir,
                        height: 48,
                        borderColor: jaune,
                        borderStyle: "solid",
                        borderWidth: 2,
                        backgroundColor: gris,
                        paddingLeft: 10,
                        paddingRight: 0,
                      }}
                      value={formikProps.values.state}
                      onChangeText={formikProps.handleChange("state")}
                      onSubmitEditing={() => {
                        this.username.focus();
                      }}
                    />
                    {/* <Text
                      style={{
                        width: 40,

                        position: "absolute",
                        textAlign: "left",
                        left: 10,
                        bottom: 20,
                        color: jaune,
                      }}>
                      State
                    </Text> */}
                    <Text
                      style={{
                        position: "absolute",
                        bottom: -8,
                        color: "red",
                        fontSize: 10,
                        marginHorizontal: 0,
                      }}>
                      {formikProps.errors.state}
                    </Text>
                  </View>
                </View>
                <View>
                  <TextInput
                    returnKeyType={"next"}
                    ref={(input) => {
                      this.username = input;
                    }}
                    placeholder={"Username"}
                    placeholderTextColor={jaune}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                    style={{
                      color: jaune,
                      marginHorizontal: 10,
                      marginBottom: 5,
                      marginTop: 20,
                      backgroundColor: noir,
                      height: 48,
                      borderColor: jaune,
                      borderStyle: "solid",
                      borderWidth: 2,
                      backgroundColor: gris,
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                    value={formikProps.values.username}
                    onChangeText={formikProps.handleChange("username")}
                    onSubmitEditing={() => {
                      this.password.focus();
                    }}
                  />
                  {/* <Text
                    style={{
                      width: 80,

                      position: "absolute",
                      textAlign: "left",
                      left: 20,
                      bottom: 20,
                      color: jaune,
                    }}>
                    Username
                  </Text> */}
                  <Text
                    style={{
                      position: "absolute",
                      bottom: -8,
                      color: "red",
                      fontSize: 10,
                      marginHorizontal: 20,
                    }}>
                    {formikProps.errors.username}
                  </Text>
                </View>
                <View>
                  <TextInput
                    returnKeyType={"next"}
                    ref={(input) => {
                      this.password = input;
                    }}
                    placeholder={"Password"}
                    placeholderTextColor={jaune}
                    autoCorrect={false}
                    autoCapitalize={"none"}
                    secureTextEntry={true}
                    style={{
                      color: jaune,
                      marginHorizontal: 10,
                      marginBottom: 5,
                      marginTop: 20,
                      backgroundColor: noir,
                      height: 48,
                      borderColor: jaune,
                      borderStyle: "solid",
                      borderWidth: 2,
                      backgroundColor: gris,
                      paddingHorizontal: 10,
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                    value={formikProps.values.password}
                    onChangeText={formikProps.handleChange("password")}
                    onSubmitEditing={() => {
                      this.passwordConf.focus();
                    }}
                  />
                  {/* <Text
                    style={{
                      width: 80,

                      position: "absolute",
                      textAlign: "left",
                      left: 20,
                      bottom: 20,
                      color: jaune,
                    }}>
                    Password
                  </Text> */}
                  <Text
                    style={{
                      position: "absolute",
                      bottom: -8,
                      color: "red",
                      fontSize: 10,
                      marginHorizontal: 20,
                    }}>
                    {formikProps.errors.password}
                  </Text>
                </View>
                <View>
                  <TextInput
                    returnKeyType={"done"}
                    ref={(input) => {
                      this.passwordConf = input;
                    }}
                    placeholder={"Password confirm."}
                    placeholderTextColor={jaune}
                    autoCorrect={false}
                    autoCapitalize={"none"}
                    secureTextEntry={true}
                    style={{
                      color: jaune,
                      marginHorizontal: 10,
                      marginBottom: 5,
                      marginTop: 20,
                      backgroundColor: noir,
                      height: 48,
                      borderColor: jaune,
                      borderStyle: "solid",
                      borderWidth: 2,
                      backgroundColor: gris,
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}
                    mode="outlined"
                    value={formikProps.values.passwordConf}
                    onChangeText={formikProps.handleChange("passwordConf")}
                  />
                  {/* <Text
                    style={{
                      width: 80,

                      position: "absolute",
                      textAlign: "left",
                      left: 20,
                      bottom: 12,
                      color: jaune,
                    }}>
                    Password confirm.
                  </Text> */}
                  <Text
                    style={{
                      position: "absolute",
                      bottom: -8,
                      color: "red",
                      fontSize: 10,
                      marginHorizontal: 20,
                    }}>
                    {formikProps.errors.passwordConf}
                  </Text>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    marginVertical: 0,
                    marginHorizontal: 5,
                    marginTop: 10,
                  }}>
                  <Button
                    style={{
                      width: 200,
                      alignSelf: "center",
                    }}
                    labelStyle={{ fontSize: 10 }}
                    mode="text"
                    onPress={() => this.props.navigation.navigate("Signin")}>
                    I HAVE AN ACCOUNT
                  </Button>
                </View>

                <TouchableOpacity
                  style={{
                    width: 300,
                    height: 50,
                    alignSelf: "center",
                    justifyContent: "center",
                    marginTop: 30,
                    alignItems: "center",
                    borderRadius: 0,
                    backgroundColor: jaune,
                  }}
                  onPress={formikProps.handleSubmit}>
                  <Text style={{
                    paddingHorizontal: 80,
                    paddingVertical: 10,
                    fontFamily: "Arial",
                    fontWeight: "700",
                    fontSize: 17
                  }}>CONTINUE</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </Formik>
        </KeyboardAvoidingView>

        <Snackbar
          visible={this.state.visible}
          onDismiss={() => this.setState({ visible: false })}
          duration={3000}
          action={{
            label: "Undo",
            onPress: () => {
              // Do something
            },
          }}>
          {this.state.snackbarText}
        </Snackbar>
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  const { user, logged, statusUser, groups } = state.user;
  return { user, logged, statusUser, groups };
};
export default connect(mapStateToProps, { createUser, setUserStatus, getGroups })(signup);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: noir,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
});
