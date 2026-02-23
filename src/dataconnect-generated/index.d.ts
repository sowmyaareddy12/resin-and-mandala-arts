import { ConnectorConfig, DataConnect, QueryRef, QueryPromise } from 'firebase/data-connect';

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

interface GetArtistProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetArtistProfileVariables): QueryRef<GetArtistProfileData, GetArtistProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetArtistProfileVariables): QueryRef<GetArtistProfileData, GetArtistProfileVariables>;
  operationName: string;
}
export const getArtistProfileRef: GetArtistProfileRef;

export function getArtistProfile(vars: GetArtistProfileVariables): QueryPromise<GetArtistProfileData, GetArtistProfileVariables>;
export function getArtistProfile(dc: DataConnect, vars: GetArtistProfileVariables): QueryPromise<GetArtistProfileData, GetArtistProfileVariables>;

