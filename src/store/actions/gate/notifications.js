import { notificationSchema } from 'store/schemas/gate';
import {
  FETCH_NOTIFICATIONS_COUNT,
  FETCH_NOTIFICATIONS_COUNT_SUCCESS,
  FETCH_NOTIFICATIONS_COUNT_ERROR,
  FETCH_NOTIFICATIONS,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_ERROR,
  MARK_ALL_NOTIFICATIONS_VIEWED,
  MARK_ALL_NOTIFICATIONS_VIEWED_SUCCESS,
  MARK_ALL_NOTIFICATIONS_VIEWED_ERROR,
  MARK_NOTIFICATION_VIEWED,
  MARK_NOTIFICATION_VIEWED_SUCCESS,
  MARK_NOTIFICATION_VIEWED_ERROR,
} from 'store/constants/actionTypes';
import { NOTIFICATIONS_PER_PAGE } from 'constants/notifications';
import { CALL_GATE } from 'store/middlewares/gate-api';

export const getNotificationsCount = () => ({
  [CALL_GATE]: {
    types: [
      FETCH_NOTIFICATIONS_COUNT,
      FETCH_NOTIFICATIONS_COUNT_SUCCESS,
      FETCH_NOTIFICATIONS_COUNT_ERROR,
    ],
    method: 'onlineNotify.historyFresh',
    params: {
      app: 'gls',
    },
  },
  meta: {
    waitAutoLogin: true,
  },
});

export const fetchNotifications = ({ fromId } = {}) => dispatch => {
  const params = {
    limit: NOTIFICATIONS_PER_PAGE,
    types: ['all'],
    markAsViewed: false,
    fromId,
    app: 'gls',
  };

  return dispatch({
    [CALL_GATE]: {
      types: [FETCH_NOTIFICATIONS, FETCH_NOTIFICATIONS_SUCCESS, FETCH_NOTIFICATIONS_ERROR],
      method: 'onlineNotify.history',
      params,
      schema: { data: [notificationSchema] },
    },
    meta: {
      ...params,
      waitAutoLogin: true,
    },
  });
};

export const markAllViewed = () => ({
  [CALL_GATE]: {
    types: [
      MARK_ALL_NOTIFICATIONS_VIEWED,
      MARK_ALL_NOTIFICATIONS_VIEWED_SUCCESS,
      MARK_ALL_NOTIFICATIONS_VIEWED_ERROR,
    ],
    method: 'notify.markAllAsViewed',
    params: {
      app: 'gls',
    },
  },
  meta: {
    waitAutoLogin: true,
  },
});

export const markAsViewed = id => {
  let ids;

  if (Array.isArray(id)) {
    ids = id;
  } else {
    ids = [id];
  }

  const params = {
    ids,
    app: 'gls',
  };

  return {
    [CALL_GATE]: {
      types: [
        MARK_NOTIFICATION_VIEWED,
        MARK_NOTIFICATION_VIEWED_SUCCESS,
        MARK_NOTIFICATION_VIEWED_ERROR,
      ],
      method: 'notify.markAsViewed',
      params,
    },
    meta: {
      ...params,
      waitAutoLogin: true,
    },
  };
};

export const subscribeNotifications = () => ({
  [CALL_GATE]: {
    method: 'onlineNotify.on',
    params: {
      app: 'gls',
    },
  },
  meta: {
    waitAutoLogin: true,
  },
});

export const unsubscribeNotifications = () => ({
  [CALL_GATE]: {
    method: 'onlineNotify.off',
    params: {
      app: 'gls',
    },
  },
  meta: {
    waitAutoLogin: true,
  },
});
