import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'

export default class rules extends Component {
  render() {
    return (
      <View style={{ paddingBottom: 50 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              height: 60,
              color: '#edd798',
              fontFamily: 'Monda',
              fontSize: 30,
              fontWeight: '600',
              lineHeight: 35,
              alignSelf: 'center',
              marginTop: 50,
            }}>
            How To Play
          </Text>
          <View style={{ alignItems: 'center' }}>
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
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                QUICK LOOK- WEEKLY PICKS
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`Pick 6 games each week:\n
- 1 Power Game- 10 points (from your Power Conference, selected during sign-up)\n
- 1 Binding Conference Game-10 points (assigned from the weekly schedule)\n
- 3 other games- 7 points each (no restrictions)\n
- 1 Dog Game (pick an underdog to win straight up, not to cover. Underdogs only.)\n`}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                QUICK LOOK - WAYS TO PICK & SCORE
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`Perfecto – Win five separate games, double your points. (Dog game excluded)\n
Stacking – Pick a game more than once.\n
Parlay – Group games together to win bonus points. Must win all games in parlay.\n
$Lines – Pick an underdog to win the game, and win the points of the spread.\n
***ALL PICKS ARE DUE NO LATER THAN KICKOFF OF THE SATURDAY MORNING GAMES.  NO EXCEPTIONS.  THE CFGL IS NOT RESPONSIBLE FOR ANY TECHNICAL ISSUES IN YOU SUBMITTING YOUR PICKS.  PLEASE TAKE A SCREEN-SHOT BEFORE YOU SUBMIT.***`}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'center', marginBottom: 0 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                RULES & SCORING: Each week you select six games.
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',

                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                Pick #1: Power Game (10 points)
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`
- Before the season starts pick a conference to be your Power Conference

- Every week you’ll pick one game from your Power Conference. This is your Power Game. 

- Pro tip: Don’t pick a conference you know nothing about (ex: The Sun Belt Conference)
                `}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                Pick #2: Binding Game (10 points)
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`
- Week’s 1 thru 10 you’ll pick one game from the Binding Conference schedule below

- Binding Games are worth 10 points, just like your Power Game

- For the final three weeks of the year, you will select two games from your power conference 
                `}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    color: '#edd798',
                    fontFamily: 'Arial',
                    fontSize: RFValue(12),
                    fontWeight: '400',
                  }}>
                  {`

WEEK 1- B1G    
WEEK 2- CUSA
WEEK 3- BIG XII 
WEEK 4- MAC
WEEK 5- SUNBELT 
WEEK 6- AAC
WEEK 7- MTN WEST
WEEK 8- PAC-12
WEEK 9-ACC 
WEEK 10- SEC
WEEK 11- POWER CONF 
WEEK 12- POWER CONF
WEEK 13- POWER CONF
WEEK 14- CHAMPIONSHIP WEEK* 
                `}
                </Text>
              </View>
              <Text
                style={{
                  color: '#edd798',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`

*Championship week scoring below.   
                `}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                Pick #3-5: Free Picks: (7 points each)
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`
- After your Power Game and Binding Game, you have 3 picks left.

- These are worth 7 points each.

- Pick any game you want, any conference, any way that you choose, no restrictions
                `}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                Bonus Pick (#6): Dog Game (points = spread)
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`
-  Every week pick an underdog. If the underdog wins (not covers), you’ll win the spread points \n
Ex: Purdue +5 (If Purdue wins the game you’ll get the 5 points. If they lose the game, no points)
                `}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                SCORING NOTE
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`
-  All ties are worth 3 points. Includes Power, Binding and Free picks
                `}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                SCORING STRATEGY OPTIONS:
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`
The path to the championship is one that winds many different ways, so the CFGL offers a multitude of options for picking strategies each week. Here are the ways to pick and score.
                `}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                The “Perfecto” = (Double Your Points)
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`
If you pick and win 5 separate games in a week (Bonus Dog Game excluded), we will double your point total for the week. To get this bonus you must:
- Pick five separate games (no stacking)
- Win them all (no ties)
- You may select an over/under and dog/favorite in the same game, however, not a $line & underdog.
                `}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                Stacking
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`
You may pick a game more than once and we call this “stacking”. Stacking disqualifies you from the “Perfecto” bonus, but will score big on a game that you think is a “lock”. You may stack one game as many times as you can, while still meeting your Power and Binding requirements for the week.
                `}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                Parlay (20 bonus points)
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`
You can play for bonus points by grouping “free pick” games together in a 3-team parlay. If all the games in the parlay win, you win 20 bonus points on top of your points for the games.
If one of your parlay games lose, all the games in the parlay lose. High risk, high reward. Only 3-team parlays are available and ONLY FREE PICKS (non-Power, non-Binding) are available to parlay.

- Parlay Note: If there’s a push (tie) in a parlay, the parlay disappears and all games will be scored normally.
                `}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                Money-line (Earn Points + The spread)
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`
You pick an underdog to win straight up, without the spread. If the underdog wins the game outright on the scoreboard, you not only win your points, but also the # of points that the spread was worth.
Ex: Ole Miss (+4) ($)
If you take the money-line ($) and Ole Miss wins the game, you get 7 points for winning the game, plus 4 points for giving up those points. If Ole Miss is your Power or Binding Game, you get 10 points for the game plus 4 bonus points of the spread.
                `}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                Our Regular Season:
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`
The regular season starts Week 1 and ends after Conference Championship Week. We update player standings weekly and the member with the most points at the end of the regular season wins the League title.
                `}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                Conference Play:
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`
Once membership is officially locked, we randomly pick names out of a Notre Dame hat to form ten conferences. Conferences are important because:
- Each week, the conference winners will win 10 bonus points added to their point total for the year.
- Each week, the conference winner is awarded a $25 Conference Chip. Conference Chips are
redeemed for prize money at the end of the season.
- At the end of the season, conference winners will receive their membership fee back as a prize for
winning their conference.


NOTE:
Chips will not be awarded, instead carried over to the following week. For example, if there is a tie score in week two in your conference, the week three winner would be awarded two chips, or $50.
                `}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                Scoring in Week14 – Championship Week
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`
During Championship Week, the format is simple:
- Pick five of the ten conference championship games- non-championship games are not included in picks.
- Assign each 25, 20, 15, 10, and 5 point value to each game.
- You win your 25 game, you win 25 points. You win your 15 game, you win 15 pts. No stacking, but Parlays
and Perfectos are still in play.
                `}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                Making the Top 100:
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`
If you make the top100, you get to play the Bowl Season for free. If you finish outside the top 100, you pay $25 (or a Conference Chip) to enter into the Bowl Season.
Abandoned teams will be auctioned off to CFGL members, CFGL outsiders, and Rick Neuheisel.
                `}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View
              style={{
                width: '90%',
                height: 38,
                marginTop: 40,
                backgroundColor: '#edd798',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: '#191919',
                  fontFamily: 'Arial',
                  fontSize: RFValue(12),
                  fontWeight: '700',
                  marginLeft: 20,
                }}>
                Bowl Season
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
                  fontSize: RFValue(12),
                  fontWeight: '400',
                }}>
                {`
We wipe the scoreboard clean and all start from zero again for Bowl Season. Currently, there are 41 Bowl Games this year. You must pick all bowl games and then assign them a point value from 1 through 41. Your 41 game is worth 41 points and your 1 game is worth 1 point. Your 15 game is worth 15 points, and so on and so forth. You can only have one game of each value.
You may pick the spread or the over/under.
Yes, you can pick $lines but NO parlays or stacking.
                `}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
