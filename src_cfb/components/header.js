import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'

export default class Header extends Component {
  render() {
    const { title } = this.props
    return (
      <View
        style={{
          backgroundColor: '#edd798',
          justifyContent: 'center',
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginTop: 20,
        }}>
        <Text
          style={{
            color: '#191919',
            fontFamily: 'Monda',
            fontSize: RFValue(11),
            fontWeight: '700',
          }}>
          {title.toUpperCase()}
        </Text>
      </View>
    )
  }
}
