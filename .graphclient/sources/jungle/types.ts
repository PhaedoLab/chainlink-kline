// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace JungleTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
  Int8: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Query = {
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
  volumeFee?: Maybe<VolumeFee>;
  volumeFees: Array<VolumeFee>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QuerytradeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytradesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Trade_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryvolumeFeeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryvolumeFeesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VolumeFee_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<VolumeFee_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
  volumeFee?: Maybe<VolumeFee>;
  volumeFees: Array<VolumeFee>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptiontradeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontradesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Trade_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionvolumeFeeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionvolumeFeesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VolumeFee_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<VolumeFee_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Trade = {
  id: Scalars['Bytes'];
  account: Scalars['Bytes'];
  ledger: Scalars['BigInt'];
  currencyKey: Scalars['String'];
  amount: Scalars['BigInt'];
  keyPrice: Scalars['BigInt'];
  fee: Scalars['BigInt'];
  type: Scalars['BigInt'];
  totalVal: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  eventid: Scalars['String'];
};

export type Trade_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  account?: InputMaybe<Scalars['Bytes']>;
  account_not?: InputMaybe<Scalars['Bytes']>;
  account_gt?: InputMaybe<Scalars['Bytes']>;
  account_lt?: InputMaybe<Scalars['Bytes']>;
  account_gte?: InputMaybe<Scalars['Bytes']>;
  account_lte?: InputMaybe<Scalars['Bytes']>;
  account_in?: InputMaybe<Array<Scalars['Bytes']>>;
  account_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  account_contains?: InputMaybe<Scalars['Bytes']>;
  account_not_contains?: InputMaybe<Scalars['Bytes']>;
  ledger?: InputMaybe<Scalars['BigInt']>;
  ledger_not?: InputMaybe<Scalars['BigInt']>;
  ledger_gt?: InputMaybe<Scalars['BigInt']>;
  ledger_lt?: InputMaybe<Scalars['BigInt']>;
  ledger_gte?: InputMaybe<Scalars['BigInt']>;
  ledger_lte?: InputMaybe<Scalars['BigInt']>;
  ledger_in?: InputMaybe<Array<Scalars['BigInt']>>;
  ledger_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currencyKey?: InputMaybe<Scalars['String']>;
  currencyKey_not?: InputMaybe<Scalars['String']>;
  currencyKey_gt?: InputMaybe<Scalars['String']>;
  currencyKey_lt?: InputMaybe<Scalars['String']>;
  currencyKey_gte?: InputMaybe<Scalars['String']>;
  currencyKey_lte?: InputMaybe<Scalars['String']>;
  currencyKey_in?: InputMaybe<Array<Scalars['String']>>;
  currencyKey_not_in?: InputMaybe<Array<Scalars['String']>>;
  currencyKey_contains?: InputMaybe<Scalars['String']>;
  currencyKey_contains_nocase?: InputMaybe<Scalars['String']>;
  currencyKey_not_contains?: InputMaybe<Scalars['String']>;
  currencyKey_not_contains_nocase?: InputMaybe<Scalars['String']>;
  currencyKey_starts_with?: InputMaybe<Scalars['String']>;
  currencyKey_starts_with_nocase?: InputMaybe<Scalars['String']>;
  currencyKey_not_starts_with?: InputMaybe<Scalars['String']>;
  currencyKey_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  currencyKey_ends_with?: InputMaybe<Scalars['String']>;
  currencyKey_ends_with_nocase?: InputMaybe<Scalars['String']>;
  currencyKey_not_ends_with?: InputMaybe<Scalars['String']>;
  currencyKey_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  keyPrice?: InputMaybe<Scalars['BigInt']>;
  keyPrice_not?: InputMaybe<Scalars['BigInt']>;
  keyPrice_gt?: InputMaybe<Scalars['BigInt']>;
  keyPrice_lt?: InputMaybe<Scalars['BigInt']>;
  keyPrice_gte?: InputMaybe<Scalars['BigInt']>;
  keyPrice_lte?: InputMaybe<Scalars['BigInt']>;
  keyPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  keyPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee?: InputMaybe<Scalars['BigInt']>;
  fee_not?: InputMaybe<Scalars['BigInt']>;
  fee_gt?: InputMaybe<Scalars['BigInt']>;
  fee_lt?: InputMaybe<Scalars['BigInt']>;
  fee_gte?: InputMaybe<Scalars['BigInt']>;
  fee_lte?: InputMaybe<Scalars['BigInt']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  type?: InputMaybe<Scalars['BigInt']>;
  type_not?: InputMaybe<Scalars['BigInt']>;
  type_gt?: InputMaybe<Scalars['BigInt']>;
  type_lt?: InputMaybe<Scalars['BigInt']>;
  type_gte?: InputMaybe<Scalars['BigInt']>;
  type_lte?: InputMaybe<Scalars['BigInt']>;
  type_in?: InputMaybe<Array<Scalars['BigInt']>>;
  type_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalVal?: InputMaybe<Scalars['BigInt']>;
  totalVal_not?: InputMaybe<Scalars['BigInt']>;
  totalVal_gt?: InputMaybe<Scalars['BigInt']>;
  totalVal_lt?: InputMaybe<Scalars['BigInt']>;
  totalVal_gte?: InputMaybe<Scalars['BigInt']>;
  totalVal_lte?: InputMaybe<Scalars['BigInt']>;
  totalVal_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalVal_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  eventid?: InputMaybe<Scalars['String']>;
  eventid_not?: InputMaybe<Scalars['String']>;
  eventid_gt?: InputMaybe<Scalars['String']>;
  eventid_lt?: InputMaybe<Scalars['String']>;
  eventid_gte?: InputMaybe<Scalars['String']>;
  eventid_lte?: InputMaybe<Scalars['String']>;
  eventid_in?: InputMaybe<Array<Scalars['String']>>;
  eventid_not_in?: InputMaybe<Array<Scalars['String']>>;
  eventid_contains?: InputMaybe<Scalars['String']>;
  eventid_contains_nocase?: InputMaybe<Scalars['String']>;
  eventid_not_contains?: InputMaybe<Scalars['String']>;
  eventid_not_contains_nocase?: InputMaybe<Scalars['String']>;
  eventid_starts_with?: InputMaybe<Scalars['String']>;
  eventid_starts_with_nocase?: InputMaybe<Scalars['String']>;
  eventid_not_starts_with?: InputMaybe<Scalars['String']>;
  eventid_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  eventid_ends_with?: InputMaybe<Scalars['String']>;
  eventid_ends_with_nocase?: InputMaybe<Scalars['String']>;
  eventid_not_ends_with?: InputMaybe<Scalars['String']>;
  eventid_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Trade_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Trade_filter>>>;
};

export type Trade_orderBy =
  | 'id'
  | 'account'
  | 'ledger'
  | 'currencyKey'
  | 'amount'
  | 'keyPrice'
  | 'fee'
  | 'type'
  | 'totalVal'
  | 'timestamp'
  | 'eventid';

export type VolumeFee = {
  id: Scalars['Bytes'];
  ledger: Scalars['BigInt'];
  vol: Scalars['BigInt'];
  fee: Scalars['BigInt'];
  date: Scalars['String'];
};

export type VolumeFee_filter = {
  id?: InputMaybe<Scalars['Bytes']>;
  id_not?: InputMaybe<Scalars['Bytes']>;
  id_gt?: InputMaybe<Scalars['Bytes']>;
  id_lt?: InputMaybe<Scalars['Bytes']>;
  id_gte?: InputMaybe<Scalars['Bytes']>;
  id_lte?: InputMaybe<Scalars['Bytes']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id_contains?: InputMaybe<Scalars['Bytes']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']>;
  ledger?: InputMaybe<Scalars['BigInt']>;
  ledger_not?: InputMaybe<Scalars['BigInt']>;
  ledger_gt?: InputMaybe<Scalars['BigInt']>;
  ledger_lt?: InputMaybe<Scalars['BigInt']>;
  ledger_gte?: InputMaybe<Scalars['BigInt']>;
  ledger_lte?: InputMaybe<Scalars['BigInt']>;
  ledger_in?: InputMaybe<Array<Scalars['BigInt']>>;
  ledger_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  vol?: InputMaybe<Scalars['BigInt']>;
  vol_not?: InputMaybe<Scalars['BigInt']>;
  vol_gt?: InputMaybe<Scalars['BigInt']>;
  vol_lt?: InputMaybe<Scalars['BigInt']>;
  vol_gte?: InputMaybe<Scalars['BigInt']>;
  vol_lte?: InputMaybe<Scalars['BigInt']>;
  vol_in?: InputMaybe<Array<Scalars['BigInt']>>;
  vol_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee?: InputMaybe<Scalars['BigInt']>;
  fee_not?: InputMaybe<Scalars['BigInt']>;
  fee_gt?: InputMaybe<Scalars['BigInt']>;
  fee_lt?: InputMaybe<Scalars['BigInt']>;
  fee_gte?: InputMaybe<Scalars['BigInt']>;
  fee_lte?: InputMaybe<Scalars['BigInt']>;
  fee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  fee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  date?: InputMaybe<Scalars['String']>;
  date_not?: InputMaybe<Scalars['String']>;
  date_gt?: InputMaybe<Scalars['String']>;
  date_lt?: InputMaybe<Scalars['String']>;
  date_gte?: InputMaybe<Scalars['String']>;
  date_lte?: InputMaybe<Scalars['String']>;
  date_in?: InputMaybe<Array<Scalars['String']>>;
  date_not_in?: InputMaybe<Array<Scalars['String']>>;
  date_contains?: InputMaybe<Scalars['String']>;
  date_contains_nocase?: InputMaybe<Scalars['String']>;
  date_not_contains?: InputMaybe<Scalars['String']>;
  date_not_contains_nocase?: InputMaybe<Scalars['String']>;
  date_starts_with?: InputMaybe<Scalars['String']>;
  date_starts_with_nocase?: InputMaybe<Scalars['String']>;
  date_not_starts_with?: InputMaybe<Scalars['String']>;
  date_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  date_ends_with?: InputMaybe<Scalars['String']>;
  date_ends_with_nocase?: InputMaybe<Scalars['String']>;
  date_not_ends_with?: InputMaybe<Scalars['String']>;
  date_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<VolumeFee_filter>>>;
  or?: InputMaybe<Array<InputMaybe<VolumeFee_filter>>>;
};

export type VolumeFee_orderBy =
  | 'id'
  | 'ledger'
  | 'vol'
  | 'fee'
  | 'date';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  trade: InContextSdkMethod<Query['trade'], QuerytradeArgs, MeshContext>,
  /** null **/
  trades: InContextSdkMethod<Query['trades'], QuerytradesArgs, MeshContext>,
  /** null **/
  volumeFee: InContextSdkMethod<Query['volumeFee'], QueryvolumeFeeArgs, MeshContext>,
  /** null **/
  volumeFees: InContextSdkMethod<Query['volumeFees'], QueryvolumeFeesArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  trade: InContextSdkMethod<Subscription['trade'], SubscriptiontradeArgs, MeshContext>,
  /** null **/
  trades: InContextSdkMethod<Subscription['trades'], SubscriptiontradesArgs, MeshContext>,
  /** null **/
  volumeFee: InContextSdkMethod<Subscription['volumeFee'], SubscriptionvolumeFeeArgs, MeshContext>,
  /** null **/
  volumeFees: InContextSdkMethod<Subscription['volumeFees'], SubscriptionvolumeFeesArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["jungle"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
