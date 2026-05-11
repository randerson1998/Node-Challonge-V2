const {
  TournamentNotifications,
  TournamentMatchOptions,
  TournamentRegistrationOptions,
  TournamentSeedingOptions,
  TournamentStationOptions,
  TournamentGroupStageOptions,
  DoubleEliminationOptions,
  RoundRobinOptions,
  SwissOptions,
  FreeForAllOptions,
} = require('./tournamentOptions');

class Tournament {
  constructor({ id, type, attributes = {} }) {
    this.id = id;
    this.type = type;

    this.name = attributes.name;
    this.url = attributes.url;// optional
    this.tournamentType = attributes.tournament_type;
    this.gameName = attributes.game_name; // optional
    this.private = attributes.private; // optional
    this.startsAt = attributes.starts_at; // optional
    this.description = attributes.description; // optional

    this.notifications = TournamentNotifications.from(attributes.notifications); // optional
    this.matchOptions = TournamentMatchOptions.from(attributes.match_options);// optional
    this.registrationOptions = TournamentRegistrationOptions.from(attributes.registration_options);// optional
    this.seedingOptions = TournamentSeedingOptions.from(attributes.seeding_options);// optional
    this.stationOptions = TournamentStationOptions.from(attributes.station_options);// optional
    this.groupStageEnabled = attributes.group_stage_enabled;
    this.groupStageOptions = TournamentGroupStageOptions.from(attributes.group_stage_options);// optional
    this.doubleEliminationOptions = DoubleEliminationOptions.from(attributes.double_elimination_options);// optional
    this.roundRobinOptions = RoundRobinOptions.from(attributes.round_robin_options);// optional
    this.swissOptions = SwissOptions.from(attributes.swiss_options);// optional
    this.freeForAllOptions = FreeForAllOptions.from(attributes.free_for_all_options);// optional
    this.tieBreaks = attributes.tie_breaks;// optional
  }

  static fromResource(resource) {
    return new Tournament(resource);
  }

  static fromListResponse(response) {
    return (response.data || []).map(Tournament.fromResource);
  }

  static fromSingleResponse(response) {
    return Tournament.fromResource(response.data);
  }
}

module.exports = Tournament;