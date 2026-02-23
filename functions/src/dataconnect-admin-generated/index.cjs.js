const { validateAdminArgs } = require('firebase-admin/data-connect');

const connectorConfig = {
  connector: 'example',
  serviceId: 'resin-and-mandala-arts',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

function getArtistProfile(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('GetArtistProfile', inputVars, inputOpts);
}
exports.getArtistProfile = getArtistProfile;

