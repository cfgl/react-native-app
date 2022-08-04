export const conferences = [
  {
    ConferenceID: 1,
    Name: "American Athletic - East",
    ConferenceName: "American Athletic",
    DivisionName: "East",
  },
  {
    ConferenceID: 2,
    Name: "American Athletic - West",
    ConferenceName: "American Athletic",
    DivisionName: "West",
  },
  {
    ConferenceID: 3,
    Name: "Atlantic Coast - Atlantic",
    ConferenceName: "Atlantic Coast",
    DivisionName: "Atlantic",
  },
  {
    ConferenceID: 4,
    Name: "Atlantic Coast - Coastal",
    ConferenceName: "Atlantic Coast",
    DivisionName: "Coastal",
  },
  {
    ConferenceID: 5,
    Name: "Big 12",
    ConferenceName: "Big 12",
    DivisionName: null,
  },
  {
    ConferenceID: 6,
    Name: "Big Ten - East",
    ConferenceName: "Big Ten",
    DivisionName: "East",
  },
  {
    ConferenceID: 7,
    Name: "Big Ten - West",
    ConferenceName: "Big Ten",
    DivisionName: "West",
  },
  {
    ConferenceID: 8,
    Name: "Conference USA - East",
    ConferenceName: "Conference USA",
    DivisionName: "East",
  },
  {
    ConferenceID: 9,
    Name: "Conference USA - West",
    ConferenceName: "Conference USA",
    DivisionName: "West",
  },
  {
    ConferenceID: 10,
    Name: "FBS Independents",
    ConferenceName: "FBS Independents",
    DivisionName: null,
  },
  {
    ConferenceID: 11,
    Name: "Mid-American - East",
    ConferenceName: "Mid-American",
    DivisionName: "East",

  },
  {
    ConferenceID: 12,
    Name: "Mid-American - West",
    ConferenceName: "Mid-American",
    DivisionName: "West",
  },
  {
    ConferenceID: 13,
    Name: "Mountain West - Mountain",
    ConferenceName: "Mountain West",
    DivisionName: "Mountain",
  },
  {
    ConferenceID: 14,
    Name: "Mountain West - West",
    ConferenceName: "Mountain West",
    DivisionName: "West",
  },
  {
    ConferenceID: 15,
    Name: "Pac-12 - North",
    ConferenceName: "Pac-12",
    DivisionName: "North",
  },
  {
    ConferenceID: 16,
    Name: "Pac-12 - South",
    ConferenceName: "Pac-12",
    DivisionName: "South",
  },
  {
    ConferenceID: 17,
    Name: "SEC - East",
    ConferenceName: "SEC",
    DivisionName: "East",
  },
  {
    ConferenceID: 18,
    Name: "SEC - West",
    ConferenceName: "SEC",
    DivisionName: "West",
  },
  {
    ConferenceID: 19,
    Name: "Sun Belt - East",
    ConferenceName: "Sun Belt",
    DivisionName: "East",
  },
  {
    ConferenceID: 20,
    Name: "Sun Belt - West",
    ConferenceName: "Sun Belt",
    DivisionName: "West",
  }
];


export const divisionGroup = () => {
  let data = conferences.filter(f => f.DivisionName !== null).sort(function (a, b) {
    return b.DivisionName - a.DivisionName;
  });

  // this gives an object with dates as keys
  const groups = data.reduce((groups, conf) => {
    const DivisionName = conf.DivisionName;
    if (!groups[DivisionName]) {
      groups[DivisionName] = [];
    }

    groups[DivisionName].push(conf);

    return groups;
  }, {});

  // Edit: to add it in the array format instead
  let groupArrays = Object.keys(groups).map((DivisionName) => {
    return {
      DivisionName,
      divisionGroup: groups[DivisionName],
    };
  });

  groupArrays = [{
    DivisionName: "All",
    conferencesGroup: []
  }].concat(groupArrays).concat([{
    DivisionName: "Cancel"
  }])
  return groupArrays;
};

export const conferenceGroup = () => {
  let data = conferences.filter(f => f.ConferenceName !== null).sort(function (a, b) {
    return b.ConferenceName - a.ConferenceName;
  });

  // this gives an object with dates as keys
  const groups = data.reduce((groups, conf) => {
    const ConferenceName = conf.ConferenceName;
    if (!groups[ConferenceName]) {
      groups[ConferenceName] = [];
    }

    groups[ConferenceName].push(conf);

    return groups;
  }, {});

  // Edit: to add it in the array format instead
  let groupArrays = Object.keys(groups).map((ConferenceName) => {
    return {
      ConferenceName,
      conferencesGroup: groups[ConferenceName],
    };
  });

  groupArrays = [{
    ConferenceName: "All",
    conferencesGroup: []
  }].concat(groupArrays).concat([{
    ConferenceName: "Cancel"
  }])
  return groupArrays;
};