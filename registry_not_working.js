/**
 * registry for prediction market
 */
class PredictRegistry {
  constructor() {
    LocalContractStorage.defineProperties(this, {
      list: null, // list of prediction market
      owner: null, // owner of this contract
    });
  }

  init() {
    let from = Blockchain.transaction.from;
    this.owner = from;
    this.list = [];
  }

  add(contractAddr) {
    // for some reason.  this does not work.  list is still empty
    this.list.push(contractAddr);
    return this.list;
  }

  remove(contractAddr) {
    let from = Blockchain.transaction.from;
    if (this.owner === from) {
      const index = list.indexOf(contractAddr);
    
      if (index !== -1) {
        list.splice(index, 1);
      }
    }
  }

  getList() {
    return this.list;
  }
}

module.exports = PredictRegistry;