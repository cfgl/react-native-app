import React, { Component } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator
} from "react-native";

import { SERVER_URL, SPORTDATA_API_TOKEN } from "@env"
import { Button, Snackbar } from "react-native-paper";
import { jaune, noir, gris } from "../styles/colors";
import { connect } from "react-redux";
import {
  loginUser,
  getConferences,
  setUserStatus,
  introUser,
} from "../redux/actions/user";
import { Formik } from "formik";
import * as yup from "yup";
import { TouchableOpacity } from "react-native-gesture-handler";
const validationSchema = yup.object().shape({
  email: yup.string().required().min(4).label("Email"),
  password: yup.string().required().label("Password"),
});
class signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      visible: false,
      snackbarText: "",
      loading: false,
    };
  }
  go = () => {
    if (this.props.hasBoarded === false) {
      this.props.introUser(true);
    } else {
      // this.props.navigation.navigate("Signin");
    }
  };

  componentDidMount() {
    this.go();
    this.props.getConferences(this.props.user.jwt);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.statusUser == "STARTED_LOGIN") {
      this.props.setUserStatus("");
      this.setState({ loading: true });
    } else if (this.props.statusUser == "FAILLED_LOGIN") {
      this.props.setUserStatus("");
      this.setState({
        loading: false,
        visible: true,
        snackbarText:
          `
        1- Username/Email or password incorrect
        2- Verify that your email is valid
        `,
      });
    } else if (this.props.statusUser == "SUCCESSED_LOGIN") {
      this.props.setUserStatus("");
      this.setState({
        loading: false,
      });
    }
    if (
      this.props.logged === true &&
      this.props.statusUser == "SUCCESSED_LOGIN"
    ) {
    }
  }

  render() {
    const { email, username, password } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={gris} barStyle="light-content" />

        {/* 
       
        */}
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={styles.container}>
          <Image
            source={require("../images/HomeHeader.jpg")}
            style={{ height: "40%", width: "100%", marginBottom: 20 }}
          />

          <Formik
            enableReinitialize
            initialValues={
              {
                // email: "sauvenel2013@gmail.com",
                // password: "qwerty",
              }
            }
            onSubmit={(values) => {
              //this.props.navigation.navigate("MyHomeTabs");
              //alert(JSON.stringify(values));
              this.props.loginUser(values.email, values.password);
              Keyboard.dismiss();
            }}
            validationSchema={validationSchema}>
            {(formikProps) => (
              <View>
                <View>
                  <TextInput
                    returnKeyType={"next"}
                    placeholder="Email or Username"
                    placeholderTextColor={jaune}
                    keyboardType={"email-address"}
                    autoCapitalize={"none"}
                    style={{
                      color: jaune,
                      marginHorizontal: 20,
                      marginBottom: 5,
                      marginTop: 10,
                      backgroundColor: noir,
                      height: 48,
                      borderColor: jaune,
                      borderStyle: "solid",
                      borderWidth: 2,
                      backgroundColor: gris,
                      paddingHorizontal: 10,
                    }}
                    value={formikProps.values.email}
                    onChangeText={formikProps.handleChange("email")}
                    onSubmitEditing={() => {
                      this.password.focus();
                    }}
                    blurOnSubmit={false}
                  />
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

                <View>
                  <TextInput
                    returnKeyType={"done"}
                    ref={(input) => {
                      this.password = input;
                    }}
                    placeholderTextColor={jaune}
                    secureTextEntry={true}
                    autoCapitalize={"none"}
                    placeholder="Password"
                    placeholderTextColor={jaune}
                    style={{
                      color: jaune,
                      marginHorizontal: 20,
                      marginBottom: 5,
                      marginTop: 20,
                      backgroundColor: noir,
                      height: 48,
                      borderColor: jaune,
                      borderStyle: "solid",
                      borderWidth: 2,
                      backgroundColor: gris,
                      paddingHorizontal: 10,
                    }}
                    mode="outlined"
                    value={formikProps.values.password}
                    onChangeText={formikProps.handleChange("password")}
                  />
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
                <View
                  style={{
                    flexDirection: "row",
                    marginVertical: 0,
                    marginHorizontal: 5,
                    marginTop: 10,
                  }}>
                  <Button
                    style={{
                      width: "40%",
                      alignSelf: "center",
                    }}
                    labelStyle={{ fontSize: 8, textDecorationLine: "underline" }}
                    mode="text"
                    onPress={() =>
                      this.props.navigation.navigate("ForgetPassword")
                    }>
                    Forget password?
                  </Button>
                  <Button
                    style={{
                      width: "60%",
                      alignSelf: "center",
                    }}
                    labelStyle={{
                      color: jaune,
                      fontFamily: "Arial",
                      fontSize: 10,
                      fontWeight: "400",
                    }}
                    mode="text"
                    onPress={() => this.props.navigation.navigate("Signup")}>
                    Don't have an account?
                  </Button>
                </View>

                {this.state.loading === true ? (
                  // <Image
                  //   source={require("../images/loading.gif")}
                  //   style={{
                  //     width: 40,
                  //     height: 40,
                  //     alignSelf: "center",
                  //     marginVertical: 10,
                  //   }}
                  // />
                  <ActivityIndicator />
                ) : null}

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

                  mode="contained"
                  onPress={formikProps.handleSubmit}>
                  <Text style={{
                    paddingHorizontal: 80,
                    paddingVertical: 10,
                    fontFamily: "Arial",
                    fontWeight: "700",
                    fontSize: 17
                  }}>SIGNIN</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>

        <Snackbar
          visible={this.state.visible}
          onDismiss={() => this.setState({ visible: false })}
          duration={8000}
          action={{
            label: "Undo",
            onPress: () => {
              // Do something
            },
          }}>
          {this.state.snackbarText}
        </Snackbar>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  const { user, logged, statusUser, hasBoarded } = state.user;
  return { user, logged, statusUser, hasBoarded };
};
export default connect(mapStateToProps, {
  loginUser,
  getConferences,
  setUserStatus,
  introUser,
})(signin);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
