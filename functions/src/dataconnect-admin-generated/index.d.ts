import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface Artist_Key {
  id: UUIDString;
  __typename?: 'Artist_Key';
}

export interface ArtworkCollection_Key {
  artworkId: UUIDString;
  collectionId: UUIDString;
  __typename?: 'ArtworkCollection_Key';
}

export interface Artwork_Key {
  id: UUIDString;
  __typename?: 'Artwork_Key';
}

export interface Collection_Key {
  id: UUIDString;
  __typename?: 'Collection_Key';
}

export interface GetArtistProfileData {
  artist?: {
    id: UUIDString;
    displayName?: string | null;
    bio?: string | null;
    profilePictureUrl?: string | null;
  } & Artist_Key;
}

export interface GetArtistProfileVariables {
  artistId: UUIDString;
}

export interface Inquiry_Key {
  id: UUIDString;
  __typename?: 'Inquiry_Key';
}

/** Generated Node Admin SDK operation action function for the 'GetArtistProfile' Query. Allow users to execute without passing in DataConnect. */
export function getArtistProfile(dc: DataConnect, vars: GetArtistProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetArtistProfileData>>;
/** Generated Node Admin SDK operation action function for the 'GetArtistProfile' Query. Allow users to pass in custom DataConnect instances. */
export function getArtistProfile(vars: GetArtistProfileVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<GetArtistProfileData>>;

