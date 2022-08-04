import React, { Component } from 'react'
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
  TouchableOpacity,
} from 'react-native'

import { Button, Snackbar } from 'react-native-paper'
import { jaune, noir, gris } from '../styles/colors'
import { connect } from 'react-redux'
import { loginUser, getConferences, setUserStatus, forgetPassword, resetPassword } from '../redux/actions/user'
import { Formik } from 'formik'
import * as yup from 'yup'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'

const validationSchema = yup.object().shape({
  email: yup.string().required().min(4).label('Email / Username'),
})
const validationSchema2 = yup.object().shape({
  code: yup.string().required(),
  password: yup.string().required(),
  passwordConfirmation: yup.string().required(),
})
class signin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      username: '',
      password: '',
      visible: false,
      snackbarText: '',
      loading: false,
      resetNow: false,
    }
  }

  // componentDidMount() {
  //   this.props.getConferences(this.props.user.jwt);
  // }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.statusUser == 'STARTED_FORGOT') {
      this.props.setUserStatus('')
      this.setState({ loading: true })
    } else if (this.props.statusUser == 'FAILLED_LOGIN') {
      this.props.setUserStatus('')
      this.setState({
        loading: true,
        visible: true,
        snackbarText: 'Username/Email or password is/are bad',
      })
    } else if (this.props.statusUser == 'SUCCESSED_FORGOT') {
      alert('A code has been send to your email to reset your password')
      this.props.setUserStatus('')
      this.setState({
        loading: false,
        resetNow: true,
      })
    }
  }

  render() {
    const { email, username, password, resetNow } = this.state
    if (this.props.logged === true) {
      //this.props.navigation.navigate("HomeTabs");
    }
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={gris} barStyle="light-content" />

        {/* 
       
        */}
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} style={styles.container}>
          <Image
            source={require('../images/HomeHeader.png')}
            style={{ height: '40%', resizeMode: 'contain', width: '100%', marginBottom: 20 }}
          />
          {!resetNow ? (
            <Formik
              enableReinitialize
              initialValues={
                {
                  //email: "jeansauvenel.beaudry@gmail.com",
                  // password: "qwerty",
                }
              }
              onSubmit={values => {
                this.props.forgetPassword(values.email)

                Keyboard.dismiss()
              }}
              validationSchema={validationSchema}>
              {formikProps => (
                <View>
                  <View>
                    <TextInput
                      returnKeyType={'done'}
                      placeholder="Email"
                      placeholderTextColor={jaune}
                      keyboardType={'email-address'}
                      autoCapitalize={'none'}
                      style={{
                        color: jaune,
                        marginHorizontal: 20,
                        marginBottom: 5,
                        marginTop: 10,
                        backgroundColor: noir,
                        height: RFValue(48),
                        fontSize: RFValue(13),
                        borderColor: jaune,
                        borderStyle: 'solid',
                        borderWidth: 2,
                        backgroundColor: gris,
                        paddingHorizontal: 10,
                      }}
                      value={formikProps.values.email}
                      onChangeText={formikProps.handleChange('email')}
                    />
                    <Text
                      style={{
                        color: 'red',
                        fontSize: RFValue(10),
                        marginHorizontal: 20,
                      }}>
                      {formikProps.errors.email}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      marginVertical: 0,
                      marginHorizontal: 5,
                      marginTop: 10,
                    }}>
                    <Button
                      style={{
                        alignSelf: 'center',
                      }}
                      labelStyle={{ fontSize: RFValue(10) }}
                      mode="text"
                      onPress={() => this.props.navigation.navigate('Signin')}>
                      HAVE AN ACCOUNT
                    </Button>
                    <Button
                      style={{
                        alignSelf: 'center',
                      }}
                      labelStyle={{
                        color: jaune,
                        fontFamily: 'Arial',
                        fontSize: RFValue(10),
                        fontWeight: '400',
                      }}
                      mode="text"
                      onPress={() => this.props.navigation.navigate('Signup')}>
                      Don't have an account? Signup
                    </Button>
                  </View>

                  {this.props.loading == true ? (
                    <Image source={require('../images/loading.gif')} style={{ width: 40, height: 40 }} />
                  ) : null}

                  <TouchableOpacity
                    style={{
                      width: RFValue(250),
                      height: RFValue(40),
                      alignSelf: 'center',
                      justifyContent: 'center',
                      marginTop: 30,
                      alignItems: 'center',
                      borderRadius: 0,
                      backgroundColor: jaune,
                    }}
                    mode="contained"
                    onPress={formikProps.handleSubmit}>
                    <Text
                      style={{
                        paddingHorizontal: 80,
                        paddingVertical: 10,
                        fontFamily: 'Arial',
                        fontWeight: '700',
                        fontSize: 17,
                      }}>
                      RESET PASSWORD
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          ) : (
            <Formik
              enableReinitialize
              initialValues={
                {
                  //email: "jeansauvenel.beaudry@gmail.com",
                  // password: "qwerty",
                }
              }
              onSubmit={values => {
                //this.props.navigation.navigate("MyHomeTabs");
                //alert(JSON.stringify(values));
                this.props.resetPassword(values)

                console.log(values)
                //alert("En developement");
                Keyboard.dismiss()
              }}
              validationSchema={validationSchema2}>
              {formikProps => (
                <View>
                  <View>
                    <TextInput
                      returnKeyType={'done'}
                      placeholder="Code"
                      placeholderTextColor={jaune}
                      style={{
                        color: jaune,
                        marginHorizontal: 20,
                        marginBottom: 5,
                        marginTop: 10,
                        backgroundColor: noir,
                        height: RFValue(48),
                        fontSize: RFValue(13),
                        borderColor: jaune,
                        borderStyle: 'solid',
                        borderWidth: 2,
                        backgroundColor: gris,
                        paddingHorizontal: 10,
                      }}
                      value={formikProps.values.code}
                      onChangeText={formikProps.handleChange('code')}
                    />
                    <Text
                      style={{
                        color: 'red',
                        fontSize: 10,
                        marginHorizontal: 20,
                      }}>
                      {formikProps.errors.code}
                    </Text>
                  </View>
                  <View>
                    <TextInput
                      returnKeyType={'done'}
                      placeholder="New password"
                      placeholderTextColor={jaune}
                      secureTextEntry
                      autoCapitalize={'none'}
                      style={{
                        color: jaune,
                        marginHorizontal: 20,
                        marginBottom: 5,
                        marginTop: 10,
                        backgroundColor: noir,
                        height: RFValue(48),
                        fontSize: RFValue(13),
                        borderColor: jaune,
                        borderStyle: 'solid',
                        borderWidth: 2,
                        backgroundColor: gris,
                        paddingHorizontal: 10,
                      }}
                      value={formikProps.values.password}
                      onChangeText={formikProps.handleChange('password')}
                    />
                    <Text
                      style={{
                        color: 'red',
                        fontSize: 10,
                        marginHorizontal: 20,
                      }}>
                      {formikProps.errors.password}
                    </Text>
                  </View>
                  <View>
                    <TextInput
                      returnKeyType={'done'}
                      placeholder="Conf. new password"
                      placeholderTextColor={jaune}
                      secureTextEntry
                      autoCapitalize={'none'}
                      style={{
                        color: jaune,
                        marginHorizontal: 20,
                        marginBottom: 5,
                        marginTop: 10,
                        backgroundColor: noir,
                        height: RFValue(48),
                        fontSize: RFValue(13),
                        borderColor: jaune,
                        borderStyle: 'solid',
                        borderWidth: 2,
                        backgroundColor: gris,
                        paddingHorizontal: 10,
                      }}
                      value={formikProps.values.passwordConfirmation}
                      onChangeText={formikProps.handleChange('passwordConfirmation')}
                    />
                    <Text
                      style={{
                        color: 'red',
                        fontSize: 10,
                        marginHorizontal: 20,
                      }}>
                      {formikProps.errors.passwordConfirmation}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      marginVertical: 0,
                      marginHorizontal: 5,
                      marginTop: 10,
                    }}>
                    <Button
                      style={{
                        alignSelf: 'center',
                      }}
                      labelStyle={{ fontSize: RFValue(10) }}
                      mode="text"
                      onPress={() => this.props.navigation.navigate('Signin')}>
                      HAVE AN ACCOUNT
                    </Button>
                    <Button
                      style={{
                        alignSelf: 'center',
                      }}
                      labelStyle={{
                        color: jaune,
                        fontFamily: 'Arial',
                        fontSize: RFValue(10),
                        fontWeight: '400',
                      }}
                      mode="text"
                      onPress={() => this.props.navigation.navigate('Signup')}>
                      Don't have an account? Signup
                    </Button>
                  </View>
                  {this.props.loading == true ? (
                    <Image source={require('../images/loading.gif')} style={{ width: 40, height: 40 }} />
                  ) : null}

                  <TouchableOpacity
                    style={{
                      width: RFValue(250),
                      height: RFValue(40),
                      alignSelf: 'center',
                      justifyContent: 'center',
                      marginTop: 30,
                      alignItems: 'center',
                      borderRadius: 0,
                      backgroundColor: jaune,
                    }}
                    mode="contained"
                    onPress={formikProps.handleSubmit}>
                    <Text
                      style={{
                        paddingHorizontal: 80,
                        paddingVertical: 10,
                        fontFamily: 'Arial',
                        fontWeight: '700',
                        fontSize: RFValue(17),
                      }}>
                      RESET PASSWORD
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          )}
        </KeyboardAvoidingView>

        <Snackbar
          visible={this.state.visible}
          onDismiss={() => this.setState({ visible: false })}
          duration={3000}
          action={{
            label: 'Undo',
            onPress: () => {
              // Do something
            },
          }}>
          {this.state.snackbarText}
        </Snackbar>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => {
  const { user, logged, statusUser, token } = state.user
  return { user, logged, statusUser, token }
}
export default connect(mapStateToProps, {
  loginUser,
  getConferences,
  setUserStatus,
  forgetPassword,
  resetPassword,
})(signin)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: noir,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
})
