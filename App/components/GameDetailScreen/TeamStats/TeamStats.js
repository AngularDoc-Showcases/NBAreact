import React, { Component } from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import TeamMap from '../../../utils/TeamMap'
import Loader from '../../common/Loader'
import RefreshButton from '../../common/RefreshButton'
import LeadTracker from './LeadTracker'
import TeamStatsTable from './TeamStatsTable'
import QuarterScores from './QuarterScores'

class TeamStats extends Component<Props> {

  static navigationOptions = ({ navigation }) => ({
    headerTitle: `${navigation.state.params.title}`,
    headerRight: (
      <RefreshButton
        handleRefresh={navigation.state.params.handleRefresh}
      />
    )
  })

  constructor(props) {
    super(props)

    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    // we can now call fetchGameStats via navigation.state.params.handleRefresh
    this.props.navigation.setParams({ handleRefresh: this.fetchGameStats })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.props.teamStats !== null &&
      this.props.teamStats !== undefined &&
      this.props.teamStats !== {} &&
      prevProps.teamStats === undefined
    ) {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { isLoading } = this.state;
    let { teamStats, homeTeam, awayTeam } = this.props;
    teamStats ? teamStats : null;

    const awayTeamColor = TeamMap[awayTeam.abbreviation.toLowerCase()] ? TeamMap[awayTeam.abbreviation.toLowerCase()].color : '#1C3F80'
    const homeTeamColor = TeamMap[homeTeam.abbreviation.toLowerCase()] ? TeamMap[homeTeam.abbreviation.toLowerCase()].color : '#BE0E2C'

    let leadTracker = teamStats && teamStats.leadTracker ? teamStats.leadTracker : null;
    let miniBoxscoreData = teamStats && teamStats.miniBoxscoreData ? teamStats.miniBoxscoreData : null;
    let teamBoxscoreData = teamStats &&  teamStats.teamBoxscoreData ? teamStats.teamBoxscoreData : null;

    return (
      <View style={{ flex: 1, backgroundColor: '#111111' }}>
        { isLoading && <Loader /> }
        {
          (teamStats && teamBoxscoreData && leadTracker && miniBoxscoreData) &&
          <ScrollView contentContainerStyle={styles.teamStatsContainer}>
            <QuarterScores
              miniBoxscore={miniBoxscoreData}
            />
            <View style={styles.leadTracker}>
              <View style={styles.leadTrackerHeader}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.text18pt}> Lead Tracker </Text>
                </View>
                <LeadTracker
                  homeTeamID={homeTeam.teamID}
                  awayTeamID={awayTeam.teamID}
                  homeTeamColor={homeTeamColor}
                  awayTeamColor={awayTeamColor}
                  leadtracker={leadTracker}
                />
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.text18pt}> Times Tied: {teamStats.timesTied} </Text>
                  <Text style={styles.text18pt}> Lead Changes: {teamStats.leadChanges} </Text>
                </View>
              </View>
            </View>
            <View style={styles.teamComparison}>
              <TeamStatsTable
                awayTeamColor={awayTeamColor}
                homeTeamColor={homeTeamColor}
                stats={teamBoxscoreData}
              />
            </View>
          </ScrollView>
        }
        {
          !isLoading && teamStats === {} &&
          <View style={styles.defaultCenteredView}>
            <Text style={styles.text}> Teams stats avaliable after tip off </Text>
          </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    color: '#D3D3D3',
    fontFamily: 'Rubik-Light'
  },
  text18pt: {
    textAlign: 'center',
    color: '#D3D3D3',
    fontSize: 18,
    fontFamily: 'Rubik-Light'
  },
  defaultCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  teamStatsContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#111111'
  },
  /* quarter scores */
  teamQuarterScores: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 10
  },
  teamQuarterHeader: {
    flex: 1,
    justifyContent: 'center'
  },
  teamQuarterChart: {
    flex: 2,
    justifyContent: 'center'
  },
  /******************/
  /* lead tracker chart */
  leadTracker: {
    // flex: 3
    height: 260,
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10
  },
  leadTrackerHeader: {
    flex: 1,
    justifyContent: 'center'
  },
  /******************/
  /* team comparison */
  teamComparison: {
    flex: 1,
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    borderTopWidth: 1,
    borderTopColor: '#D3D3D3',
    flexDirection: 'row'
  },
  /******************/
})

function mapStateToProps(state) {
  return {
    gameID: state.scores.selectedGame.gameID,
    awayTeam: state.scores.selectedGame.awayTeam,
    homeTeam: state.scores.selectedGame.homeTeam,
    date: state.date.date,
    teamStats: state.scores.selectedGame.teamStats
  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamStats)
