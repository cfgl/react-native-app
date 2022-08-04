////////////////////////////////////////////////////////////////
import { teams } from '../datas/teams'

const gameString = game => {
  if (game) {
    let favorite = game.PointSpread && game.PointSpread < 0 ? '@' + game.HomeTeam : game.AwayTeam
    let dog = game.PointSpread && game.PointSpread > 0 ? '@' + game.HomeTeam : game.AwayTeam

    //console.log(JSON.stringify(game, null, 2));
    return `${favorite} (${(game.PointSpread && game.PointSpread) || '~~'}) - ${dog} (${
      (game.OverUnder && game.OverUnder) || '~~'
    }) `
  } else {
    return ''
  }
}
const getTeamById = id => {
  let res = teams.filter(f => f.TeamID === id)
  if (res.length > 0) return res[0]
  else return {}
}
const betsGroupBy = bets => {
  let data = bets.sort(function (a, b) {
    return b.week - a.week
  })

  // this gives an object with dates as keys
  const groups = data.reduce((groups, game) => {
    const week = game.week
    if (!groups[week]) {
      groups[week] = []
    }

    groups[week].push(game)

    return groups
  }, {})

  // Edit: to add it in the array format instead
  const groupArrays = Object.keys(groups).map(week => {
    return {
      week,
      games: groups[week],
    }
  })

  return groupArrays
}
const GroupByGroup = players => {
  // this gives an object with dates as keys
  const groups = players.reduce((groups, item) => {
    const group = item.user.group
    if (!groups[group]) {
      groups[group] = []
    }

    groups[group].push(item)

    return groups
  }, {})

  // Edit: to add it in the array format instead
  const groupArrays = Object.keys(groups).map(group => {
    // console.log(JSON.stringify(groups[group], null, 2))
    return {
      group,
      player: groups[group],
    }
  })

  return groupArrays
}
const betsGroupByWeek = bets => {
  let data = bets.sort(function (a, b) {
    return b.week - a.week
  })

  // this gives an object with dates as keys
  const groups = data.reduce((groups, game) => {
    const week = game.week
    if (!groups[week]) {
      groups[week] = []
    }

    groups[week].push(game)

    return groups
  }, {})

  // Edit: to add it in the array format instead
  const groupArrays = Object.keys(groups).map(week => {
    return {
      week,
      games: groups[week],
    }
  })

  return groupArrays
}
const checkDuplicate = arr => {
  var valueArr = arr.map(function (item) {
    //console.log(JSON.stringify(item.game.Game, null, 2));

    return item.game.Game
  })
  var isDuplicate = valueArr.some(function (item, idx) {
    return valueArr.indexOf(item) != idx
  })

  return isDuplicate
}
/////////////////////////////////////////////////////////////////

const winWeekParlay = (bets, hasParley) => {
  let res = 0

  let pickPoint = bets
    .filter(i => i.betType.value.includes('pick') && i.canParlay === true)
    .reduce((a, b) => a + b.points, 0)

  if (hasParley == true) {
    res = bets.filter(i => i.canParlay === true).length > 2 ? 30 : -pickPoint
  } else {
    res = 0
  }

  return res
}
const winWeekPerfecto = allBets => {
  let totPerfecto = 0
  let winGames = allBets.filter(i => i.win === true && i.betType.value !== 'dog game')
  const haveStack = checkDuplicate(winGames)
  totPerfecto = winGames.length === 5 && haveStack === false ? winGames.reduce((a, b) => a + b.points, 0) : 0

  //if (haveWeekParley === true && WinParlay === false) {totPerfecto = 0;}

  return totPerfecto
}
const winPoints = (game, betType, betMethod) => {
  const absolute = val => {
    return val < 0 ? val * -1 : val
  }
  //Test winning game
  let win =
    game.rats.toLowerCase() === betMethod.value.toLowerCase() ||
    game.ou_result.toLowerCase() === betMethod.value.toLowerCase()
      ? true
      : false

  let points = 0

  //power game
  if (betType.value === 'power game') {
    if (win === true) {
      if (betMethod.value === 'push') {
        points = 3
      } else if (betMethod.value === '$line') {
        points = points + betType.point + absolute(parseFloat(game.Spread))
      } else {
        points = points + betType.point
      }
    }
  }

  //binding game
  if (betType.value === 'binding game') {
    if (win === true) {
      if (betMethod.value === 'push') {
        points = 3
      } else if (betMethod.value === '$line') {
        points = points + betType.point + absolute(parseFloat(game.Spread))
      } else {
        points = points + betType.point
      }
    }
  }

  //binding game
  if (betType.value.includes('pick')) {
    if (win === true) {
      if (betMethod.value === 'push') {
        points = 3
      } else if (betMethod.value === '$line') {
        points = points + betType.point + absolute(parseFloat(game.Spread))
      } else {
        points = points + betType.point
      }
    }
  }

  //dog game
  if (betType.value === 'dog game') {
    if (win === true) {
      if (betMethod.value === '$line') {
        points = points + absolute(parseFloat(game.Spread))
      }
    }
  }

  //Test if this game can parlay
  let canParlay =
    win === true &&
    (betType.value === 'pick1' || betType.value === 'pick2' || betType.value === 'pick3') &&
    game.rats.toLowerCase() !== 'push'
      ? true
      : false

  //Result of this bet
  let bet = {
    week: 1,
    game: game,
    betType: betType,
    betMethod: betMethod,
    win: win,
    points: points,
    canParlay,
  }

  return bet
}

/////////////////////////////////////////////////////////////////

const points = (allBets, id) => {
  let results = []

  let bets = allBets.filter(i => i.user._id == id)

  let groupedBets = betsGroupBy(bets)

  for (let index = 0; index < groupedBets.length; index++) {
    const element2 = groupedBets[index]

    let weekBets = []

    for (let index = 0; index < element2.games.length; index++) {
      const element = element2.games[index]

      let favorite = element.game.HomeTeamMoneyLine < 0 ? element.game.HomeTeam : element.game.AwayTeam
      let dog = element.game.AwayTeamMoneyLine > 0 ? element.game.AwayTeam : element.game.HomeTeam

      let favoriteSc =
        element.game.HomeTeamMoneyLine < 0
          ? element.game.Periods.reduce((a, b) => a + b.HomeScore, 0)
          : element.game.Periods.reduce((a, b) => a + b.AwayScore, 0)

      let dogSc =
        element.game.AwayTeamMoneyLine > 0
          ? element.game.Periods.reduce((a, b) => a + b.AwayScore, 0)
          : element.game.Periods.reduce((a, b) => a + b.HomeScore, 0)

      let tot = dogSc + favoriteSc
      let overUnder = tot < element.game.OverUnder ? 'UNDER' : tot > element.game.OverUnder ? 'OVER' : ''

      let spread = dogSc - favoriteSc

      let ratsOut =
        spread > element.game.PointSpread * -1 && favoriteSc > dogSc
          ? 'FAVE'
          : spread < element.game.PointSpread * -1 && favoriteSc > dogSc
          ? 'DOG'
          : spread === element.game.PointSpread && favoriteSc > dogSc
          ? 'PUSH'
          : favoriteSc < dogSc
          ? '$LINE'
          : ''

      let pts = winPoints(
        {
          Game: gameString(element.game),
          Fave: favorite,
          Dog: dog,
          Spread: element.game.PointSpread,
          ou: element.game.OverUnder,
          FavoriteScore: favoriteSc,
          UnderdogScore: dogSc,
          ou_score: favoriteSc + dogSc,
          rats: ratsOut,
          ou_result: overUnder,
          week: 1,
        },
        element.type,
        element.method,
      )
      weekBets.push(pts)
      results.push(pts)
    }
  }

  return results
}

const parleyPoints = (allBets, id, myparlay) => {
  let results = 0

  let bets = allBets.filter(i => i.user._id == id)

  let groupedBets = betsGroupBy(bets)

  for (let index = 0; index < groupedBets.length; index++) {
    const element2 = groupedBets[index]

    let weekBets = []

    for (let index = 0; index < element2.games.length; index++) {
      const element = element2.games[index]

      let favorite = element.game.HomeTeamMoneyLine < 0 ? element.game.HomeTeam : element.game.AwayTeam
      let dog = element.game.AwayTeamMoneyLine > 0 ? element.game.AwayTeam : element.game.HomeTeam

      let favoriteSc =
        element.game.HomeTeamMoneyLine < 0
          ? element.game.Periods.reduce((a, b) => a + b.HomeScore, 0)
          : element.game.Periods.reduce((a, b) => a + b.AwayScore, 0)

      let dogSc =
        element.game.AwayTeamMoneyLine > 0
          ? element.game.Periods.reduce((a, b) => a + b.AwayScore, 0)
          : element.game.Periods.reduce((a, b) => a + b.HomeScore, 0)

      let tot = dogSc + favoriteSc
      let overUnder = tot < element.game.OverUnder ? 'UNDER' : tot > element.game.OverUnder ? 'OVER' : ''

      let spread = dogSc - favoriteSc

      let ratsOut =
        spread > element.game.PointSpread * -1 && favoriteSc > dogSc
          ? 'FAVE'
          : spread < element.game.PointSpread * -1 && favoriteSc > dogSc
          ? 'DOG'
          : spread === element.game.PointSpread && favoriteSc > dogSc
          ? 'PUSH'
          : favoriteSc < dogSc
          ? '$LINE'
          : ''

      let pts = winPoints(
        {
          Game: gameString(element.game),
          Fave: favorite,
          Dog: dog,
          Spread: element.game.PointSpread,
          ou: element.game.OverUnder,
          FavoriteScore: favoriteSc,
          UnderdogScore: dogSc,
          ou_score: favoriteSc + dogSc,
          rats: ratsOut,
          ou_result: overUnder,
          week: 1,
        },
        element.type,
        element.method,
      )
      weekBets.push(pts)
    }
    //console.log(parseInt(element2.week));

    let ply = myparlay && myparlay.filter(i => i.week === parseInt(element2.week)).length == 1 ? true : false
    myparlay
    results = results + winWeekParlay(weekBets, ply)
  }

  return results
}

const perfectoPoints = (allBets, id) => {
  let results = 0

  let bets = allBets.filter(i => i.user._id == id)

  let groupedBets = betsGroupBy(bets)

  for (let index = 0; index < groupedBets.length; index++) {
    const element2 = groupedBets[index]

    let weekBets = []

    for (let index = 0; index < element2.games.length; index++) {
      const element = element2.games[index]

      let favorite = element.game.HomeTeamMoneyLine < 0 ? element.game.HomeTeam : element.game.AwayTeam
      let dog = element.game.AwayTeamMoneyLine > 0 ? element.game.AwayTeam : element.game.HomeTeam

      let favoriteSc =
        element.game.HomeTeamMoneyLine < 0
          ? element.game.Periods.reduce((a, b) => a + b.HomeScore, 0)
          : element.game.Periods.reduce((a, b) => a + b.AwayScore, 0)

      let dogSc =
        element.game.AwayTeamMoneyLine > 0
          ? element.game.Periods.reduce((a, b) => a + b.AwayScore, 0)
          : element.game.Periods.reduce((a, b) => a + b.HomeScore, 0)

      let tot = dogSc + favoriteSc
      let overUnder = tot < element.game.OverUnder ? 'UNDER' : tot > element.game.OverUnder ? 'OVER' : ''

      let spread = dogSc - favoriteSc

      let ratsOut =
        spread > element.game.PointSpread * -1 && favoriteSc > dogSc
          ? 'FAVE'
          : spread < element.game.PointSpread * -1 && favoriteSc > dogSc
          ? 'DOG'
          : spread === element.game.PointSpread && favoriteSc > dogSc
          ? 'PUSH'
          : favoriteSc < dogSc
          ? '$LINE'
          : ''

      let pts = winPoints(
        {
          Game: gameString(element.game),
          Fave: favorite,
          Dog: dog,
          Spread: element.game.PointSpread,
          ou: element.game.OverUnder,
          FavoriteScore: favoriteSc,
          UnderdogScore: dogSc,
          ou_score: favoriteSc + dogSc,
          rats: ratsOut,
          ou_result: overUnder,
          week: 1,
        },
        element.type,
        element.method,
      )
      weekBets.push(pts)
    }

    //let parl = winWeekParlay(weekBets, true);

    results = results + winWeekPerfecto(weekBets)
  }

  return results
}

/////////////////////////////////////////////////////////////////

let API_KEY = ''
let API_SECRET = ''
let CLOUD_NAME = ''
const CryptoJS = require('crypto-js')

const API_URL = 'https://api.cloudinary.com/v1_1/'

const init = (key, secret, cloud_name) => {
  API_KEY = key
  API_SECRET = secret
  CLOUD_NAME = cloud_name
  UPLOAD_URL = API_URL + CLOUD_NAME + '/image/upload'
}

const UploadImage = uri => {
  console.log(API_KEY, API_SECRET, CLOUD_NAME)
  let timestamp = ((Date.now() / 1000) | 0).toString()
  let hash_string = 'timestamp=' + timestamp + API_SECRET
  let signature = CryptoJS.SHA1(hash_string).toString()

  let formdata = new FormData()
  formdata.append('file', { uri: uri, type: 'image/jpg', name: timestamp })
  formdata.append('timestamp', timestamp)
  formdata.append('api_key', API_KEY)
  formdata.append('signature', signature)

  const config = {
    method: 'POST',
    body: formdata,
  }

  return fetch(UPLOAD_URL, config)
    .then(res => res.json())
    .then(res => {
      return res
    })
    .catch(err => {
      console.log(err)
    })
}

export {
  init,
  UploadImage,
  points,
  parleyPoints,
  perfectoPoints,
  GroupByGroup,
  betsGroupByWeek,
  gameString,
  getTeamById,
}
