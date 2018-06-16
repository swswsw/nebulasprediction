/**
 * registry for prediction market
 */
class PredictRegistry {
  constructor() {
    LocalContractStorage.defineProperties(this, {
      owner: null, // owner of this contract
    });
  }

  init() {
    let from = Blockchain.transaction.from;
    this.owner = from;
  }

  add(contractAddr) {
    let list = LocalContractStorage.get("list");
    if (!list) {
      list = [];
    }
    list.push(contractAddr);
    LocalContractStorage.set("list", list);
    return list;
  }

  remove(contractAddr) {
    let from = Blockchain.transaction.from;
    let list = LocalContractStorage.get("list");
    if (list) {
      const index = list.indexOf(contractAddr);
    
      if (index !== -1) {
        list.splice(index, 1);
      }

      LocalContractStorage.set("list", list);
    }
    
    return list;
  }

  getList() {
    return LocalContractStorage.get("list");
  }

  getOwner() {
    return this.owner;
  }
}

module.exports = PredictRegistry;