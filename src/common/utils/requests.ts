import { RedeemRequest, RedeemRequestStatus } from '../types/redeem.types';
import { DOT, PolkaBTC, ReplaceRequestStatus } from '@interlay/polkabtc/build/interfaces/default';
import { VaultReplaceRequest } from '../types/vault.types';
import { H256 } from '@polkadot/types/interfaces';
import {
  satToBTC,
  planckToDOT,
  stripHexPrefix,
  RedeemRequestExt as ParachainRedeemRequest,
  ReplaceRequestExt as ParachainReplaceRequest,
  Issue
} from '@interlay/polkabtc';
import Big from 'big.js';
import { Redeem } from '@interlay/polkabtc-stats';
import { formatDateTimePrecise } from './utils';

// TODO: move functions to lib

/**
 * Converts an RedeemRequest object retrieved from the parachain
 * to a UI IssueRequest object
 * @param id H256, the key of the IssueRequest object in the parachain map storage object
 * @param parachainIssueRequest ParachainIssueRequest
 * @param parachainHeight parachainHeight data (queried from the parachain)
 * @param redeemPeriod redeemPeriod data (queried from the parachain)
 * @param requiredBtcConfirmations requiredBtcConfirmations data (queried from the parachain)
 */

async function parachainToUIRedeemRequest(
  id: H256,
  parachainRedeemRequest?: ParachainRedeemRequest,
  parachainHeight?: number,
  redeemPeriod?: number,
  requiredBtcConfirmations?: number,
  requiredParachainConfirmations?: number
): Promise<RedeemRequest> {
  if (
    !parachainRedeemRequest ||
    !parachainHeight ||
    !redeemPeriod ||
    !requiredBtcConfirmations ||
    !requiredParachainConfirmations
  ) {
    [
      parachainRedeemRequest,
      parachainHeight,
      redeemPeriod,
      requiredBtcConfirmations,
      requiredParachainConfirmations
    ] = await Promise.all([
      window.polkaBTC.redeem.getRequestById(id),
      window.polkaBTC.system.getCurrentBlockNumber(),
      window.polkaBTC.redeem.getRedeemPeriod(),
      window.polkaBTC.btcRelay.getStableBitcoinConfirmations(),
      window.polkaBTC.btcRelay.getStableParachainConfirmations()
    ]);
  }
  const amountBTC = satToBTC(parachainRedeemRequest.amount_btc.toString());
  const fee = satToBTC(parachainRedeemRequest.fee.toString());
  const amountPolkaBTC = new Big(amountBTC).add(new Big(fee)).toString();
  const status = computeRedeemRequestStatus(
    parachainRedeemRequest.status.isCompleted,
    parachainRedeemRequest.status.isRetried,
    parachainRedeemRequest.status.isReimbursed,
    parachainRedeemRequest.opentime.toNumber(),
    parachainHeight,
    redeemPeriod,
    requiredBtcConfirmations,
    requiredParachainConfirmations
  );
  return {
    id: stripHexPrefix(id.toString()),
    amountPolkaBTC,
    amountBTC,
    timestamp: formatDateTimePrecise(new Date(Number(Date.now()))),
    creation: parachainRedeemRequest.opentime.toString(),
    userBTCAddress: parachainRedeemRequest.btc_address,
    userDOTAddress: parachainRedeemRequest.redeemer.toString(),
    vaultDOTAddress: parachainRedeemRequest.vault.toString(),
    btcTxId: '',
    fee,
    btcTransferFee: '0', // FIXME if necessary - not sure this is actually going to be used anywhere
    confirmations: 0,
    status
  };
}

const statsToUIRedeemRequest = (
  statsRedeem: Redeem,
  currentBTCHeight: number,
  parachainHeight: number,
  redeemPeriod: number,
  requiredBtcConfirmations: number,
  requiredParachainConfirmations: number
): RedeemRequest => ({
  id: statsRedeem.id,
  amountPolkaBTC: new Big(statsRedeem.amountInterBTC)
    .add(new Big(statsRedeem.feeInterbtc))
    .add(new Big(statsRedeem.btcTransferFee))
    .toString(),
  // FIXME: naming of vars
  amountBTC: statsRedeem.amountInterBTC,
  fee: statsRedeem.feeInterbtc,
  btcTransferFee: statsRedeem.btcTransferFee,
  timestamp: statsRedeem.timestamp,
  creation: statsRedeem.creation.toString(),
  userBTCAddress: statsRedeem.btcAddress,
  userDOTAddress: statsRedeem.requester,
  vaultDOTAddress: statsRedeem.vaultDotAddress,
  btcTxId: statsRedeem.btcTxId,
  confirmations:
    // eslint-disable-next-line no-negated-condition
    statsRedeem.confirmations !== undefined ?
      statsRedeem.confirmations : statsRedeem.btcBlockHeight ?
        currentBTCHeight - statsRedeem.btcBlockHeight + 1 : 0,
  status: computeRedeemRequestStatus(
    statsRedeem.completed,
    statsRedeem.cancelled && !statsRedeem.reimbursed,
    statsRedeem.reimbursed,
    statsRedeem.creation,
    parachainHeight,
    redeemPeriod,
    requiredBtcConfirmations,
    requiredParachainConfirmations,
    statsRedeem.btcTxId,
    statsRedeem.confirmations
  )
});

/**
 * Given parameters about a redeem request, computes its status
 *
 * @param completed boolean
 * @param cancelled boolean
 * @param reimbursed boolean
 * @param creationBlock The number of the block where this request was included
 * @param parachainHeight Height of the parachain (number of blocks)
 * @param redeemPeriod issuePeriod data (queried from the parachain)
 * @param requiredBtcConfirmations requiredBtcConfirmations data (queried from the parachain)
 * @param btcTxId (optional) Bitcoin transaction ID corresponding to this request
 * @param confirmations (optional) Confirmations of the given `btcTxId` */

function computeRedeemRequestStatus(
  completed: boolean,
  retried: boolean,
  reimbursed: boolean,
  creationBlock: number,
  parachainHeight: number,
  redeemPeriod: number,
  requiredBtcConfirmations: number,
  requiredParachainConfirmations: number,
  btcTxId = '',
  confirmations = 0
): RedeemRequestStatus {
  if (completed) {
    return RedeemRequestStatus.Completed;
  }
  if (reimbursed) {
    return RedeemRequestStatus.Reimbursed;
  }
  if (retried) {
    return RedeemRequestStatus.Retried;
  }
  if (creationBlock + redeemPeriod <= parachainHeight) {
    return RedeemRequestStatus.Expired;
  }
  if (btcTxId === '') {
    return RedeemRequestStatus.PendingWithBtcTxNotFound;
  }
  if (confirmations === 0) {
    return RedeemRequestStatus.PendingWithBtcTxNotIncluded;
  }
  if (confirmations < requiredBtcConfirmations) {
    return RedeemRequestStatus.PendingWithTooFewConfirmations;
  }

  if (creationBlock + requiredParachainConfirmations <= parachainHeight) {
    return RedeemRequestStatus.PendingWithTooFewConfirmations;
  }

  return RedeemRequestStatus.PendingWithEnoughConfirmations;
}

const parachainToUIReplaceRequests = (requests: Map<H256, ParachainReplaceRequest>): VaultReplaceRequest[] => {
  const replaceRequests: VaultReplaceRequest[] = [];
  requests.forEach((request, requestId) => {
    const [btcAddress, polkaBTC, lockedDOT] = convertParachainTypes(request);
    replaceRequests.push({
      id: stripHexPrefix(requestId.toString()),
      timestamp: request.btc_height.toString(),
      newVault: request.new_vault.toString(),
      oldVault: request.old_vault.toString(),
      btcAddress: btcAddress,
      polkaBTC: polkaBTC,
      lockedDOT: lockedDOT,
      status: parseReplaceRequestStatus(request.status)
    });
  });
  return replaceRequests;
};

const parseReplaceRequestStatus = (status: ReplaceRequestStatus): string => {
  if (status.isPending) {
    return 'Pending';
  } else if (status.isCompleted) {
    return 'Completed';
  } else if (status.isCancelled) {
    return 'Cancelled';
  }
  return '';
};

interface DynamicObject {
  [key: string]: Issue[] | RedeemRequest[];
}

const mapToArray = (map: Map<string, Issue[] | RedeemRequest[]>): DynamicObject => {
  const result: DynamicObject = {};
  map.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

const arrayToMap = (arr: Issue[][] | RedeemRequest[][]): Map<string, Issue[] | RedeemRequest[]> => {
  const map = new Map();
  // eslint-disable-next-line guard-for-in
  for (const key in arr) {
    map.set(key, arr[key]);
  }
  return map;
};

interface ParsableParachainTypes {
  // eslint-disable-next-line camelcase
  btc_address: string;
  // eslint-disable-next-line camelcase
  amount_polka_btc?: PolkaBTC;
  amount?: PolkaBTC;
  // eslint-disable-next-line camelcase
  amount_dot?: DOT;
  // eslint-disable-next-line camelcase
  griefing_collateral?: DOT;
  // eslint-disable-next-line camelcase
  premium_dot?: DOT;
}

/**
 * Parses types which belong to request objects and need parsing/conversion to be displayed in the UI.
 *
 * @param parachainObject A request object, which must have a BTC address, a PolkaBTC amount and a DOT amount.
 * @return A tuple with the parsed properties
 */

function convertParachainTypes(parachainObject: ParsableParachainTypes): [string, string, string] {
  let parsedPolkaBTC = '';
  let parsedDOT = '';

  if (parachainObject.amount_polka_btc) {
    parsedPolkaBTC = satToBTC(parachainObject.amount_polka_btc.toString());
  } else if (parachainObject.amount) {
    parsedPolkaBTC = satToBTC(parachainObject.amount.toString());
  } else {
    throw new Error('No property found for PolkaBTC amount');
  }

  if (parachainObject.premium_dot && parachainObject.premium_dot.toString() !== '0') {
    parsedDOT = planckToDOT(parachainObject.premium_dot.toString());
  } else if (parachainObject.amount_dot) {
    parsedDOT = planckToDOT(parachainObject.amount_dot.toString());
  } else if (parachainObject.griefing_collateral) {
    parsedDOT = planckToDOT(parachainObject.griefing_collateral.toString());
  } else {
    throw new Error('No property found for DOT amount');
  }

  return [parachainObject.btc_address, parsedPolkaBTC, parsedDOT];
}

export { parachainToUIRedeemRequest, statsToUIRedeemRequest, parachainToUIReplaceRequests, arrayToMap, mapToArray };
