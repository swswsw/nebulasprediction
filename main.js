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

oracleOutcome: 1, // outcome is specified by 0, 1, 2, 3

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
    console.log("bet().  outcome: ", outcome);
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
      bets = [];

    } else {

    }
    console.log("bets before adding: ", bets);

    bets.push(betObj);

    console.log("bets: ", bets);
    LocalContractStorage.set("bets", bets);

    console.log("bet() ends");
  },

  oracle: function (outcome) {
    // for this demo, only one oracle result
    console.log("oracle().  outcome: ", outcome);
    // todo: sanitize inputs
    // todo: check phase and timing
    var from = Blockchain.transaction.from;
    var value = Blockchain.transaction.value;
    var blockHeight = new BigNumber(Blockchain.block.height);
    console.log("from: " + from + ", value: " + value + ", height: " + blockHeight);

    LocalContractStorage.set("oracleOutcome", outcome);

    console.log("oracle() ends");
  },

  challenge: function () {

  },

  vote: function () {
    // for this demo, each person can vote only once.
  },

  distribute: function() {
    // distribute the token based on outcome
    console.log("distribute()");
    // todo: check phase and timing
    var from = Blockchain.transaction.from;
    var value = Blockchain.transaction.value;
    var blockHeight = new BigNumber(Blockchain.block.height);
    console.log("from: " + from + ", value: " + value + ", height: " + blockHeight);
    // from and value is not used here.


    var challenge = LocalContractStorage.get("challenge");
    var bets = LocalContractStorage.get("bets");
    var finalOutcome = LocalContractStorage.get("oracleOutcome");
    var bet;
    var user;
    var amount;
    var userOutcome;
    var payoutAmount;
    var betsIdx = 0;
    var betPoolTotal = BigNumber(0);
    var winnerPoolTotal = BigNumber(0);
    var payouts = [];
    var distribution = {
      betPoolTotal: 0,
      winnerPoolTotal: 0,
    }

    // if not challenged
    if (!challenge) {
      // distribute based on original outcome
      console.log("no challenge");

      finalOutcome = LocalContractStorage.get("oracleOutcome");

      if (finalOutcome) {

        if (bets) {

          // calculate bet pool total and winner pool total amount.
          // so we can calculate the payout based on ratio
          // of user bet in the winning pool
          for (betsIdx = 0; betsIdx < bets.length; betsIdx++) {
            bet = bets[betsIdx];
            user = bet.user;
            amount = bet.amount;
            userOutcome = bet.outcome;
            betPoolTotal = betPoolTotal.plus(amount);
            if (finalOutcome == userOutcome) {
              // winner pool
              winnerPoolTotal = winnerPoolTotal.plus(amount);
            }
          }

          console.log("betPoolTotal: " + betPoolTotal + ", winnerPoolTotal: " + winnerPoolTotal);
          distribution.betPoolTotal = betPoolTotal;
          distribution.winnerPoolTotal = winnerPoolTotal;
          LocalContractStorage.put("distribution", distribution);


          for (betsIdx = 0; betsIdx < bets.length; betsIdx++) {
            bet = bets[betsIdx];
            user = bet.user;
            amount = bet.amount;
            userOutcome = bet.outcome;
            console.log("bet: ", bet);
            // payout is user's bet in proportion to the entire pool.
            // payout = ( userAmount / winnerPoolTotal ) * betPoolTotal
            // todo: we might want to floor it to prevent multiple rounding to exceed the total payout
            payoutAmount = amount.times(betPoolTotal).dividedBy(winnerPoolTotal);
            console.log("payoutAmount: ", payoutAmount);

            if (finalOutcome == userOutcome) {
              console.log("transfer " + payoutAmount + " to " + user);
              var payoutElem = {
                user: user,
                betAmount: amount,
                payoutAmount: payoutAmount,
              }
              payouts.push(payoutElem);

              var result = Blockchain.transfer(user, payoutAmount);
              if (!result) {
                console.log("transfer failed");
                throw new Error("transfer failed.");
              }
            }
          }

          LocalContractStorage.set("payouts", payouts);
        }
      }
    }

    console.log("distribute() ends");
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
  },

  /** return bet from a particular address */
  betOf: function (address) {

  },

  getBets: function () {
    return LocalContractStorage.get("bets");
  },

  getOracleOutcome: function () {
    return LocalContractStorage.get("oracleOutcome");
  },

  /** return challenge info */
  getChallenge: function () {

  },

  voteOf: function (address) {

  },

  getVotes: function () {

  },

  /** get distribution info */
  getDistribution: function () {
    return LocalContractStorage.get("distribution");
  },

  /** get array of payout */
  getPayouts: function () {
    return LocalContractStorage.get("payouts");
  }

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
