import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';

import { dataSelector } from 'store/selectors/common';
import { getRewardsHistory } from 'store/actions/gate';
import RewardsList from './RewardsList';

export default compose(
  withRouter,
  connect(
    (state, { router, type }) => {
      const { username } = router.query;
      const userId = dataSelector(['usernames', username])(state);
      const rewards = dataSelector(['wallet', userId, 'rewards', type])(state);
      return {
        userId,
        isLoading: Boolean(rewards?.isLoading),
        items: rewards?.items || [],
        sequenceKey: rewards?.sequenceKey,
        isHistoryEnd: Boolean(rewards?.isHistoryEnd),
      };
    },
    {
      getRewardsHistory,
    }
  )
)(RewardsList);
