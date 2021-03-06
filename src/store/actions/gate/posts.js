import { postSchema } from 'store/schemas/gate';
import { POSTS_FETCH_LIMIT } from 'shared/constants';
import {
  FETCH_POST,
  FETCH_POST_SUCCESS,
  FETCH_POST_ERROR,
  FETCH_POSTS,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_ERROR,
} from 'store/constants/actionTypes';
import { currentUnsafeServerUserIdSelector } from 'store/selectors/auth';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const fetchPost = ({ userId, username, permlink }) => {
  const params = {
    app: 'gls',
    contentType: 'raw',
    userId,
    username,
    permlink,
  };

  return {
    [CALL_GATE]: {
      types: [FETCH_POST, FETCH_POST_SUCCESS, FETCH_POST_ERROR],
      method: 'content.getPost',
      params,
      schema: postSchema,
    },
    meta: params,
  };
};

export const fetchPosts = ({
  type,
  userId,
  username,
  feedType,
  sequenceKey = null,
  tags = null,
}) => (dispatch, getState) => {
  const currentUserId = currentUnsafeServerUserIdSelector(getState());

  const newParams = {
    app: 'gls',
    contentType: 'raw',
    sortBy: 'timeDesc',
    limit: POSTS_FETCH_LIMIT,
    userId: currentUserId,
  };

  if (type === 'community') {
    newParams.type = 'community';
    newParams.communityId = 'gls';

    switch (feedType) {
      case 'created':
        newParams.sortBy = 'timeDesc';
        break;
      case 'hot':
        newParams.sortBy = 'popular';
        newParams.timeframe = 'WilsonHot';
        break;
      default:
        newParams.sortBy = 'popular';
        newParams.timeframe = 'WilsonTrending';
        break;
    }
  } else if (type === 'user') {
    newParams.type = 'byUser';
    newParams.userId = userId;
    newParams.username = username;
  } else if (type === 'subscriptions') {
    newParams.type = 'subscriptions';
    newParams.userId = userId;
    newParams.username = username;
  } else {
    throw new Error('Invalid fetch posts type');
  }

  if (sequenceKey) {
    newParams.sequenceKey = sequenceKey;
  }

  if (tags && tags.length) {
    newParams.tags = tags;
  }

  if (!newParams.userId) {
    delete newParams.userId;
  }

  if (!newParams.username) {
    delete newParams.username;
  }

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_POSTS, FETCH_POSTS_SUCCESS, FETCH_POSTS_ERROR],
      method: 'content.getFeed',
      params: newParams,
      schema: {
        items: [postSchema],
      },
    },
    meta: newParams,
  });
};
