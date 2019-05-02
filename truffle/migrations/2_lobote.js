var vote = artifacts.require("Vote");
var democracy = artifacts.require("LiquidDemocracy")
var association = artifacts.require("Association")
module.exports = function(deployer) {
   deployer.deploy(vote, 1200, "Lobote", "🐺").then(function(){
      deployer.deploy(democracy, vote.address, 'transferOwnership(address)', 50)
      deployer.deploy(association, vote.address, 2, 15)
   })
}