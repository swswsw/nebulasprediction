'use strict';

/**
state info


startInfo: {
  question: "who will win the FIFA 2018",
  oracle: "n1rwlkwerwelk6l7kwerer33wlr",
  outcomes: [
    "england",
    "italy",
    "brazil",
    "germany"
  ],
}

oracleOutcome: -1, // outcome is specified by 0, 1, 2, 3, -1 indicate no outcome yet

bets: []





format of bets
{
  user: "n1klklfj389jky5jhjdasl", // should be an address
  amount: 100, // may allow multi token later
  outcome: 1, // user bets on outcome 0, 1,2,3, or...
}

format of challenge
{
  user: "0xklafj389jky5jhjdasl", // should be an address
  amount: 100,
}

format of vote
{
  user: "0xklafj389jky5jhjdasl", // should be an address
  amount: 1000,
  outcome: 1,
}



initMarket1 = {
  id: 1, // market id
  phaseTime: {}, // the start and end time of each phase (time in blockheight)
  bets: [],
  oracles: [], // list of approved oracles when market is created
  oracleOutcome: -1, // for hackathon, we only have one oracle, so we makes it simple.
                    // just one single result.  outcome is specified by 1, 2, ....
                    // 0 indicate no outcome yet
  //oracleOutcomes: [], // when oracle pushes the result, it is stored here.
  challenge: {},
  voteRecords: [], // list of all vote
  // votes: {
  //   outcome1: 0,
  //   outcome2: 0,
  //   outcome3: 0,
  // }, // aggregated result of vote
}
*/

var PredictContract = function () {
};

// save value to contract, only after height of block, users can takeout
PredictContract.prototype = {
  init: function () {
    //TODO:
  },

  start: function (startInfo) {
    console.log("start()");
    // todo: sanitize inputs
    if (startInfo) {
      var from = Blockchain.transaction.from;
      var blockHeight = new BigNumber(Blockchain.block.height);
      startInfo.from = from;
      LocalContractStorage.set("startInfo", startInfo);
    }
  },

  bet: function (outcome) {
    console.log("bet()");
    // todo: sanitize inputs
    // todo: check phase and timing
    var from = Blockchain.transaction.from;
    var value = Blockchain.transaction.value;
    var blockHeight = new BigNumber(Blockchain.block.height);
    console.log("from: " + from + ", value: " + value + ", height: " + blockHeight);

    var bets;

    // for demo, we assume only 1 bet per person
    var betObj = {
      user: from,
      amount: value,
      outcome: outcome,
    }

    bets = LocalContractStorage.get("bets");
    if (!bets) {
      // bets not exist yet
      bets = {};
      bets[from] = betObj;
    }

    console.log("bets: ", bets);
    LocalContractStorage.set("bets", bets);
  },

  oracle: function (outcome) {
    // for this demo, only one oracle result
  },

  challenge: function () {

  },

  vote: function () {
    // for this demo, each person can vote only once.
  },

  distribute: function() {

  },

  verifyAddress: function (address) {
    // 1-valid, 0-invalid
    var result = Blockchain.verifyAddress(address);
    return {
      valid: result == 0 ? false : true
    };
  },

  /** get prediction mkt info */
  getMktInfo: function () {
    return LocalContractStorage.get("startInfo");
  }

  betOf: function (address) {

  },

  getBets: function () {

  },

  getOracleResult: function () {

  },

  /** return challenge info */
  getChallenge: function () {

  },

  voteOf: function (address) {

  }

  getVotes: function () {

  },

  /** get distribution info */
  getDistribution () {

  },

};
module.exports = PredictContract;






/*


## market phase
1. open new market
2. allow bet
3. someone bets (record them)
4. market closes (by time)

## resolve phase

condition to enter phase: time

10. get datresolvea from oracle
11. determine the result and record it

condition to end phase: time

## challenge phase

condition to enter phase: time, someone triggers it

20. someone stake their coin and challenges

condition to end phase: time

## vote phase

condition to enter phase: challenge phase completed

30. anyone can stake their coin and vote

condition to end phase: time

## distribute phase
condition to enter phase: time

40. determine the final outcome

```
if (challenged)
  update the final outcome according to voting results
  distributed the staked coins in voting pool according to voting results.
distribute betting pool coins according to outcome
```

condition to end phase: when everything in the phase is executed

*/
