import React from 'react'
import { View, StatusBar, ImageBackground, SafeAreaView, Text } from 'react-native'
import { jaune, noir } from '../styles/colors'
import Swiper from 'react-native-web-swiper'
import { connect } from 'react-redux'
import { introUser } from '../redux/actions/user'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/variables'

const onboardingList = [
  {
    url: require('../images/1_onboarding.jpg'),
    title: ' ',
    subTitle: 'Use the bottom navigation to switch between screens.',
  },
  {
    url: require('../images/2_onboarding.jpg'),
    title: 'Newsfeed',
    subTitle: 'This is where you’ll see live games’ scores, Weekly roundups and more.',
  },
  {
    url: require('../images/3_onboarding.jpg'),
    title: 'Pick Center / Picks',
    subTitle: 'This is where you make your picks. Use the parlay switch to make a Parlay.',
  },
  {
    url: require('../images/4_onboarding.jpg'),
    title: 'Pick Center / Spreads',
    subTitle: 'Use the Spreads tab to see all games for a given week. Tap on a star to Shortlist a game.',
  },
  {
    url: require('../images/5_onboarding.jpg'),
    title: 'Pick Center / Picksheet',
    subTitle: 'Head to the picksheet at any time to see every players’ picks, including yours.',
  },
  {
    url: require('../images/6_onboarding.jpg'),
    title: 'League Hub',
    subTitle:
      'View your stats. Use the Standings tab to see conference standings. Use the search Player tab to find other players stats.',
  },
]
class Intro extends React.Component {
  constructor(props) {
    super(props)
    this.state = { from: 0, index: 0 }
  }
  render() {
    this.swiperRef = React.createRef()

    return (
      <SafeAreaView
        style={{
          backgroundColor: '#000',
          alignItems: 'center',
          flex: 1,
        }}>
        <StatusBar backgroundColor="#ffffff" barStyle="light-content" />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            borderRadius: 0,
            marginTop: 0,
          }}>
          <View style={{ height: SCREEN_HEIGHT - 60, width: SCREEN_WIDTH - 50 }}>
            <Swiper
              ref={this.swiperRef}
              from={this.props.from}
              minDistanceForAction={0.1}
              // controlsProps={{
              //   dotsTouchable: true,
              //   prevPos: "left",
              //   nextPos: "right",
              //   nextTitle: "",
              //   prevTitle: ""
              // }}
              onIndexChanged={index => {
                //alert(index);
                this.setState({ index: index })
              }}
              loop={false}
              controlsProps={{
                dotsTouchable: true,
                prevPos: 'left',
                nextPos: 'right',
                nextTitle: '',
                prevTitle: '',
                DotComponent: ({ index, isActive, onPress }) => {
                  if (this.state.index < onboardingList.length - 1) {
                    return (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          backgroundColor: isActive ? jaune : '#333',
                          borderRadius: 4,
                          marginTop: 30,
                          marginLeft: 8,
                          marginRight: 8,
                          marginBottom: 80,
                        }}
                      />
                    )
                  } else return null
                },
              }}>
              {onboardingList.map((item, index) => (
                <View key={index}>
                  <View
                    key={JSON.stringify(item)}
                    style={{
                      alignItems: 'center',
                      backgroundColor: 'rgba(0,0,0,.0)',
                      height: 800,
                      borderRadius: 0,
                      marginTop: 10,
                    }}>
                    <ImageBackground
                      source={item.url}
                      style={{ width: SCREEN_WIDTH - 40, height: SCREEN_HEIGHT - 280 }}
                      resizeMode="contain"
                      borderRadius={0}
                    />
                    <Text
                      style={{
                        textAlign: 'center',
                        width: '80%',
                        color: jaune,
                        fontWeight: '600',
                        fontSize: 20,
                        lineHeight: 45,
                      }}>
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        marginLeft: 10,
                        width: '80%',
                        marginTop: 0,
                        marginBottom: 0,
                        color: jaune,
                        fontFamily: 'Arial',
                        fontSize: 17,
                        fontWeight: '200',
                        lineHeight: 24,
                      }}>
                      {item.subTitle}
                    </Text>
                  </View>
                </View>
              ))}
            </Swiper>
          </View>

          {/* <Slide from={this.state.from} height={600} /> */}
        </View>

        {this.state.index === onboardingList.length - 1 && (
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              position: 'absolute',
              bottom: 20,
            }}>
            <TouchableOpacity
              style={{
                width: 170,
                height: 50,
                alignSelf: 'center',
                justifyContent: 'center',
                margin: 10,
                alignItems: 'center',
                borderRadius: 0,
                backgroundColor: jaune,
              }}
              onPress={() => {
                this.props.navigation.navigate('Signin')
              }}>
              <Text
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 0,
                  fontFamily: 'Arial',
                  color: noir,
                  fontWeight: '700',
                }}>
                GET STARTED
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => {
  const { hasBoarded } = state.user
  return { hasBoarded }
}
export default connect(mapStateToProps, { introUser })(Intro)
