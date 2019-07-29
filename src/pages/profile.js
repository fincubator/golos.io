import React, { PureComponent } from 'react';
import { withRouter } from 'next/router';

import { fetchProfile } from 'store/actions/gate';
import withTabs from 'utils/hocs/withTabs';

import UserProfile from 'containers/userProfile/UserProfile';
import BlogContent from 'containers/userProfile/blog';
import CommentsContent from 'containers/userProfile/comments';
import ActivityContent from 'containers/userProfile/activity';
import SidebarRight from 'components/userProfile/common/RightPanel';
import SettingsContent from 'containers/userProfile/settings/SettingsContent';
import RepliesContent from 'containers/userProfile/replies';
import FavoritesContent from 'containers/userProfile/favorites/index'; // doesn't work without index
import WalletContent from 'containers/userProfile/wallet/WalletContent';

const TABS = {
  feed: {
    tabName: 'Feed',
    route: 'profile',
    index: true,
    Component: BlogContent,
  },
  comments: {
    tabName: 'Comments',
    route: 'profileSection',
    Component: CommentsContent,
  },
  replies: {
    tabName: 'Replies',
    route: 'profileSection',
    Component: RepliesContent,
  },
  favorites: {
    tabName: 'Favorites',
    route: 'profileSection',
    Component: FavoritesContent,
  },
  wallet: {
    tabName: 'Wallet',
    route: 'profileSection',
    Component: WalletContent,
  },
  activity: {
    tabName: 'Activity',
    route: 'profileSection',
    Component: ActivityContent,
  },
  subscriptions: {
    tabName: 'Subscriptions',
    route: 'profileSection',
    Component: () => <div>Subscriptions Mock</div>,
  },
  settings: {
    tabName: 'Settings',
    route: 'profileSection',
    Component: SettingsContent,
  },
};

@withRouter
@withTabs(TABS, 'feed')
export default class Profile extends PureComponent {
  static async getInitialProps(ctx) {
    const {
      store,
      query: { username },
    } = ctx;

    let profile;

    try {
      profile = await store.dispatch(fetchProfile({ username }));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Profile [${username}] not found`);
    }

    return {
      userId: profile.result,
    };
  }

  render() {
    const { userId, tab, tabId, tabProps } = this.props;

    return (
      <UserProfile
        userId={userId}
        tabId={tabId}
        content={<tab.Component userId={userId} {...tabProps} />}
        sidebar={<SidebarRight userId={userId} />}
      />
    );
  }
}
