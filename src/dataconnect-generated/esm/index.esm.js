import { queryRef, executeQuery, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'resin-and-mandala-arts',
  location: 'us-east4'
};

export const getArtistProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetArtistProfile', inputVars);
}
getArtistProfileRef.operationName = 'GetArtistProfile';

export function getArtistProfile(dcOrVars, vars) {
  return executeQuery(getArtistProfileRef(dcOrVars, vars));
}

