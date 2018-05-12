'use strict';


var PredictContract = function () {
};

// save value to contract, only after height of block, users can takeout
PredictContract.prototype = {
  init: function () {
    //TODO:
  },

  start: function (height) {
  },

  bet: function (value) {
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
  },

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
