const { queryRef, executeQuery, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'resin-and-mandala-arts',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const getArtistProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetArtistProfile', inputVars);
}
getArtistProfileRef.operationName = 'GetArtistProfile';
exports.getArtistProfileRef = getArtistProfileRef;

exports.getArtistProfile = function getArtistProfile(dcOrVars, vars) {
  return executeQuery(getArtistProfileRef(dcOrVars, vars));
};
