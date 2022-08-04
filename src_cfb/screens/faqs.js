import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'

export default class faqs extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ paddingTop: 20 }} showsVerticalScrollIndicator={false}>
          {[
            { question: '', reponse: '' },
            { question: '', reponse: '' },
            { question: '', reponse: '' },
            { question: '', reponse: '' },
            { question: '', reponse: '' },
            { question: '', reponse: '' },
            { question: '', reponse: '' },
            { question: '', reponse: '' },
            { question: '', reponse: '' },
          ].map((faq, index) => (
            <View key={index} style={{ alignItems: 'center', marginBottom: 20 }}>
              <View
                style={{
                  width: '90%',
                  height: 38,
                  backgroundColor: '#edd798',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#191919',
                    fontFamily: 'Arial',
                    fontSize: 12,
                    fontWeight: '700',
                    marginLeft: 20,
                  }}>
                  Question {index + 1}
                </Text>
              </View>
              <View
                style={{
                  width: '90%',
                  backgroundColor: '#191919',
                  padding: 20,
                }}>
                <Text
                  style={{
                    color: '#edd798',
                    fontFamily: 'Arial',
                    fontSize: 14,
                    fontWeight: '400',
                    lineHeight: 18,
                  }}>
                  {`Response`}
                  {index + 1}
                </Text>
              </View>
            </View>
          ))}
          <View style={{ alignItems: 'center', marginBottom: 20 }}></View>
        </ScrollView>
      </View>
    )
  }
}
