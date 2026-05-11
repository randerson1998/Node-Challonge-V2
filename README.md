# Node Challonge V2
Wanted to make a simple API wrapper to hook in to the V2 end points of [Challonge](https://challonge.com)

## Useage Example

```
const createChallongeClient = require('challonge-v2');
const models = require('challonge-v2/src/models');

const client = new createChallongeClient.ChallongeClient({
  username: "usename",
  apiKey: "apikey",
});

async function createTournament() {
  const groupStageOptions = new models.TournamentGroupStageOptions({
    stage_type: "single elimination",
    group_size: 20,
    participant_count_to_advance_per_group: 4,
    tie_breaks: ["match wins vs tied", "game wins", "points scored"],
  });

  const swissOptions = new models.SwissOptions();

  const tournamentData = {
    name: "Node Challonge V2 Test Tournament",
    tournament_type: "swiss",
    game_name: "Beyblade X",
    group_stage_enabled: true,
    group_stage_options: groupStageOptions.toJSON(),
    swiss_options: swissOptions.toJSON(),
  };

  const createdTournament = await client.tournaments.create(tournamentData);
  console.log(createdTournament);
}

async function main() {
  const list = await client.tournaments.list();
  const tournament = await client.tournaments.get(list[0].id);

  await createTournament();
}

main();
```
