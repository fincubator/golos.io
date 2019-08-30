import React from 'react';
import { withRouter } from 'next/router';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon/Icon';
import TimeAgoWrapper from 'components/elements/TimeAgoWrapper';
import TrxLink from 'components/userProfile/wallet/common/TrxLink';

const Root = styled.div`
  opacity: 0.7;

  ${is('isIrreversible')`
    opacity: 1;
  `};

  &:nth-child(even) {
    background: #f8f8f8;
  }
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;
`;

const LineIcon = styled(Icon)`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: ${props => props.color || '#b7b7ba'};
`;

const Who = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  flex-basis: 10px;
  padding: 0 16px;
  height: 80px;
  overflow: hidden;
`;

const WhoTitle = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WhoBottom = styled.div`
  display: flex;
  align-items: center;
`;

const TimeStamp = styled.div`
  margin-right: 8px;
  font-size: 12px;
  color: #959595;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Value = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  flex-basis: 150px;
  align-items: flex-end;
  width: auto;
  height: 80px;
  justify-content: center;
`;

const Amount = styled.div`
  margin-top: 2px;
  line-height: 24px;
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.color || '#b7b7ba'};
  white-space: nowrap;
  overflow: hidden;

  @media (min-width: 890px) and (max-width: 1023px), (max-width: 639px) {
    font-size: 18px;
  }
`;

const Currency = styled.div`
  font-size: 12px;
  color: #757575;
  white-space: nowrap;
  overflow: hidden;
`;

function VestingLine({ vesting }) {
  const { diff, trxId, timestamp, isIrreversible } = vesting;

  const isPowerUp = !diff.GESTS.startsWith('-');

  const title = isPowerUp
    ? tt('user_wallet.content.power_up')
    : tt('user_wallet.content.power_down');

  let color = isPowerUp ? '#f57c02' : null;
  let icon = 'logo';
  let tooltipText = null;
  if (!isIrreversible) {
    color = null;
    icon = 'clock';
    tooltipText = tt('g.pending_transaction');
  }

  return (
    <Root isIrreversible={isIrreversible}>
      <Line>
        <LineIcon name={icon} color={color} data-toggle={tooltipText} />
        <Who>
          <WhoTitle>{title}</WhoTitle>
          <WhoBottom>
            <TimeStamp>
              <TimeAgoWrapper date={timestamp} />
            </TimeStamp>
            <TrxLink trxId={trxId} />
          </WhoBottom>
        </Who>
        <Value>
          <Amount color={color}>{diff.GOLOS}</Amount>
          <Currency>{tt('token_names.VESTING_TOKEN')}</Currency>
        </Value>
      </Line>
    </Root>
  );
}

export default withRouter(VestingLine);
