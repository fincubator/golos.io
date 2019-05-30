import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';
import Button from 'components/golos-ui/Button';

import { HeaderTitle } from '../common';

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const TextBlock = styled.div`
  flex-grow: 1;
  flex-shrink: 0;
`;

const HeaderSubtitle = styled.p`
  margin-bottom: 30px;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  letter-spacing: 0.2px;
  color: #393636;
`;

const HeaderButtons = styled.div`
  flex-shrink: 0;
`;

const LoaderWrapper = styled.div`
  margin-right: 10px;
  overflow: hidden;
  pointer-events: none;
`;

const Loader = styled(Icon).attrs({ name: 'refresh2' })`
  width: 26px;
  height: 26px;
  color: #707070;
  animation: rotate 1s linear infinite;
`;

export default class WitnessHeader extends PureComponent {
  static propTypes = {
    isWitness: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    hideLeaderActions: PropTypes.bool.isRequired,
    openBecomeLeaderDialog: PropTypes.func.isRequired,
    openManageCommunityDialog: PropTypes.func.isRequired,
  };

  onBecomeLeaderClick = () => {
    const { openBecomeLeaderDialog } = this.props;
    openBecomeLeaderDialog();
  };

  onManageClick = () => {
    const { openManageCommunityDialog } = this.props;
    openManageCommunityDialog();
  };

  renderButtons() {
    const { hideLeaderActions, isLoading, isWitness } = this.props;

    if (hideLeaderActions) {
      return null;
    }

    if (isLoading) {
      return (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      );
    }

    if (isWitness) {
      return <Button onClick={this.onManageClick}>{tt('witnesses_jsx.manage')}</Button>;
    }

    return <Button onClick={this.onBecomeLeaderClick}>{tt('witnesses_jsx.become')}</Button>;
  }

  render() {
    return (
      <Wrapper>
        <TextBlock>
          <HeaderTitle>{tt('witnesses_jsx.top_witnesses')}</HeaderTitle>
          <HeaderSubtitle>
            {/*<strong>*/}
            {/*  {tt('witnesses_jsx.you_have_votes_remaining') +*/}
            {/*    tt('witnesses_jsx.you_have_votes_remaining_count', {*/}
            {/*      count: '???',*/}
            {/*    })}*/}
            {/*  .*/}
            {/*</strong>{' '}*/}
            {tt('witnesses_jsx.you_can_vote_for_maximum_of_witnesses')}.
          </HeaderSubtitle>
        </TextBlock>
        <HeaderButtons>{this.renderButtons()}</HeaderButtons>
      </Wrapper>
    );
  }
}
