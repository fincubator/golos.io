import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'components/golos-ui/Icon';

import VotePanel from 'components/common/VotePanel';
import ReplyBlock from 'components/common/ReplyBlock';
import LoadingIndicator from 'components/elements/LoadingIndicator';

const FORCE_ONE_COLUMN_WIDTH = 550;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  z-index: 1;

  @media (max-width: ${FORCE_ONE_COLUMN_WIDTH}px) {
    flex-direction: column;
    justify-content: unset;
  }
`;

const CommentVotePanel = styled(VotePanel)`
  padding: 6px 18px 4px;

  @media (max-width: ${FORCE_ONE_COLUMN_WIDTH}px) {
    width: 100%;
  }
`;

const CommentReplyBlock = styled(ReplyBlock)`
  margin: 0;

  @media (max-width: ${FORCE_ONE_COLUMN_WIDTH}px) {
    justify-content: center;
  }
`;

const CommentRightButtons = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${FORCE_ONE_COLUMN_WIDTH}px) {
    width: 100%;
    justify-content: center;
    border-top: 1px solid #e9e9e9;
  }
`;

const Splitter = styled.div`
  flex-shrink: 0;
  width: 1px;
  height: 26px;
  margin: 0 6px;
  background: #e1e1e1;
`;

const DonateSplitter = styled(Splitter)`
  margin: 0;

  @media (max-width: ${FORCE_ONE_COLUMN_WIDTH}px) {
    flex-grow: 1;
    width: unset;
    background: unset;
  }
`;

const FooterConfirm = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 50px;
`;

const ButtonConfirm = styled.button`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  font-family: 'Open Sans', sans-serif;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: #b7b7ba;
  cursor: pointer;

  ${is('main')`
    color: #2879ff !important;
  `};

  &:hover {
    color: #393636;
  }

  &:last-child {
    padding-right: 18px;
  }
`;

const DonateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  cursor: pointer;

  @media (max-width: ${FORCE_ONE_COLUMN_WIDTH}px) {
    margin-left: 5px;
  }
`;

const LoaderWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 18px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #393636;
  cursor: pointer;
`;

export default class CommentFooter extends Component {
  static propTypes = {
    commentRef: PropTypes.shape({}),
    contentLink: PropTypes.string,
    count: PropTypes.number.isRequired,
    comment: PropTypes.shape({}).isRequired,
    edit: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,
    replyRef: PropTypes.shape({}).isRequired,
    showReply: PropTypes.bool.isRequired,
    onReplyClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
    openTransferDialog: PropTypes.func.isRequired,
  };

  static defaultProps = {
    commentRef: {},
    contentLink: '',
  };

  state = {
    isLoading: false,
  };

  handleLoading = ({ isLoading }) => {
    this.setState({ isLoading });
  };

  onCancelReplyClick = () => {
    const { replyRef } = this.props;
    replyRef.current.cancel();
  };

  onPostReplyClick = () => {
    const { replyRef } = this.props;
    replyRef.current.post(this.handleLoading);
  };

  onPostDeleteClick = () => {
    const { onDeleteClick } = this.props;
    onDeleteClick(this.handleLoading);
  };

  onCancelEditClick = () => {
    const { commentRef } = this.props;
    commentRef.current.cancel();
  };

  onSaveEditClick = () => {
    const { commentRef } = this.props;
    commentRef.current.post(this.handleLoading);
  };

  onDonateClick = async () => {
    const { comment, openTransferDialog } = this.props;

    await openTransferDialog({
      type: 'donate',
      recipientName: comment.author,
      memo: `${window.location.origin}/${comment.id}`,
    });
  };

  render() {
    const { comment, contentLink, isOwner, showReply, edit, onReplyClick, count } = this.props;
    const { isLoading } = this.state;

    if (isLoading) {
      return (
        <FooterConfirm>
          <LoaderWrapper>
            <LoadingIndicator type="circle" size={16} />
          </LoaderWrapper>
        </FooterConfirm>
      );
    }

    if (showReply) {
      return (
        <FooterConfirm>
          <ButtonConfirm onClick={this.onCancelReplyClick}>{tt('g.cancel')}</ButtonConfirm>
          <Splitter />
          <ButtonConfirm disabled={isLoading} main onClick={this.onPostReplyClick}>
            {tt('g.publish')}
          </ButtonConfirm>
        </FooterConfirm>
      );
    }

    if (edit) {
      return (
        <FooterConfirm>
          <ButtonConfirm onClick={this.onCancelEditClick}>{tt('g.cancel')}</ButtonConfirm>
          <Splitter />
          <ButtonConfirm main onClick={this.onSaveEditClick}>
            {tt('g.save')}
          </ButtonConfirm>
        </FooterConfirm>
      );
    }

    return (
      <Wrapper>
        <CommentVotePanel entity={comment} />
        <CommentRightButtons>
          {!isOwner && (
            <>
              <DonateButton
                role="button"
                name="comment-actions__donate"
                data-tooltip={tt('g.donate')}
                aria-label={tt('g.donate')}
                onClick={this.onDonateClick}
              >
                <Icon size="20" name="coins_plus" />
              </DonateButton>
              <DonateSplitter />
            </>
          )}
          {isOwner ? (
            <IconWrapper
              role="button"
              aria-label={tt('post_card.remove')}
              data-tooltip={tt('post_card.remove')}
              enabled
              onClick={this.onPostDeleteClick}
            >
              <Icon name="mute" size="20" />
            </IconWrapper>
          ) : null}
          <CommentReplyBlock
            // TODO: Fix counter
            count={count}
            text={tt('g.reply')}
            postContentId={comment.parent.post.contentId}
            onReplyClick={onReplyClick}
          />
        </CommentRightButtons>
      </Wrapper>
    );
  }
}
