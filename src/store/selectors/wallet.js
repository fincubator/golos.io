import { createSelector } from 'reselect';
import { path } from 'ramda';

import { parsePayoutAmount } from 'utils/ParsersAndFormatters';

import { dataSelector } from './common';

export const userBalanceSelector = userId => dataSelector(['wallet', userId, 'balances']);

export const userLiquidBalanceSelector = (userId, symbol = 'GOLOS') =>
  createSelector(
    [userBalanceSelector(userId)],
    balances => parsePayoutAmount(path(['liquid', 'balances', symbol], balances)) || 0
  );

export const userLiquidPaymentsSelector = userId =>
  createSelector(
    [userBalanceSelector(userId)],
    balances => parsePayoutAmount(balances?.liquid?.payments?.GOLOS) || 0
  );

export const userVestingBalanceSelector = userId =>
  createSelector(
    [userBalanceSelector(userId)],
    balances => ({
      total: parsePayoutAmount(balances?.vesting?.total?.GOLOS) || 0,
      outDelegate: parsePayoutAmount(balances?.vesting?.outDelegate?.GOLOS) || 0,
      inDelegated: parsePayoutAmount(balances?.vesting?.inDelegated?.GOLOS) || 0,
    })
  );