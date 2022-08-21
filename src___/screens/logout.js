import React, {Component} from "react";
import {Text, View, SafeAreaView} from "react-native";
import {connect} from "react-redux";
import {logoutUser} from "../redux/actions/user";
class faqs extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // this.props.logoutUser();
    // this.props.navigation.navigate("Signin");
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps) {
    }
  }

  render() {
    return (
      <SafeAreaView
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}>
        <Text> Logout </Text>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  const {user, logged, hasBoarded} = state.user;
  return {user, logged, hasBoarded};
};

export default connect(mapStateToProps, {logoutUser})(faqs);
