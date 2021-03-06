import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Flex from 'components/golos-ui/Flex';
import Button from 'components/golos-ui/Button';

const QR_SIZES = 58;
const QR_MARGIN = 18;

const Wrapper = styled.div``;

const KeyInfo = styled.div`
  flex: 1 0;

  @media (max-width: 620px) {
    max-width: calc(100% - ${QR_SIZES + QR_MARGIN}px);
  }
`;

const Key = styled.div`
  color: #393636;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  overflow-wrap: break-word;
  word-wrap: break-word;

  &:hover {
    background: #faebd7;
  }

  ${is('showPrivate')`
    color: #2879ff;

    &:hover {
      background: #d7e2fa;
    }
  `};
`;

const Hint = styled.div`
  color: #959595;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 14px;
  line-height: 19px;
  margin-top: 12px;
`;

const ButtonStyled = styled(Button)`
  max-width: 100%;
  margin-top: 25px;
  white-space: normal;
`;

const ButtonsWrapper = styled.div`
  display: flex;

  & ${ButtonStyled}:first-child {
    margin-right: 10px;
  }

  @media (max-width: 500px) {
    flex-direction: column;

    & ${ButtonStyled}:first-child {
      margin-right: 0;
    }
  }
`;

export default class ShowKey extends Component {
  static propTypes = {
    profile: PropTypes.shape(),
    pubkey: PropTypes.string.isRequired,
    privateKey: PropTypes.string,
    authType: PropTypes.string.isRequired,
    showLoginDialog: PropTypes.func.isRequired,
    showQrKeyDialog: PropTypes.func.isRequired,
  };

  static defaultProps = {
    profile: null,
    privateKey: undefined,
  };

  state = {
    showPrivate: false,
    postingPrivateKey: null,
  };

  handleToggleShow = () => {
    this.setState(state => ({ showPrivate: !state.showPrivate }));
  };

  handleShowLogin = async () => {
    const { authType, profile, showLoginDialog } = this.props;

    const { auth } = await showLoginDialog({
      isConfirm: true,
      keyRole: authType,
      lockUsername: true,
      username: profile?.username,
    });

    if (auth) {
      this.setState({ postingPrivateKey: auth.actualKey });
    }
  };

  handleShowQr = () => {
    const { authType, pubkey, privateKey, profile, showQrKeyDialog } = this.props;
    const { showPrivate } = this.state;

    const key = showPrivate ? privateKey : pubkey;

    showQrKeyDialog({
      type: authType,
      text: `${profile.userId} ${key}`,
      isPrivate: showPrivate,
    });
  };

  renderHint() {
    const { authType } = this.props;

    if (authType === 'posting') {
      return tt('userkeys_jsx.posting_key_is_required_it_should_be_different');
    }
    if (authType === 'active') {
      return tt('userkeys_jsx.the_active_key_is_used_to_make_transfers_and_place_orders');
    }
    if (authType === 'owner') {
      return (
        <>
          {tt('userkeys_jsx.the_owner_key_is_required_to_change_other_keys')}
          <br />
          {tt('userkeys_jsx.the_private_key_or_password_should_be_kept_offline')}
        </>
      );
    }

    return null;
  }

  renderButton() {
    const { authType, privateKey } = this.props;
    const { showPrivate, postingPrivateKey } = this.state;

    if (privateKey || postingPrivateKey) {
      return (
        <ButtonStyled onClick={this.handleToggleShow} light={showPrivate}>
          {showPrivate ? tt('g.hide_private_key') : tt('g.show_private_key')}
        </ButtonStyled>
      );
    }

    if (authType !== 'owner') {
      return <ButtonStyled onClick={this.handleShowLogin}>{tt('g.auth_to_show')}</ButtonStyled>;
    }

    return null;
  }

  renderQRButton() {
    return <ButtonStyled onClick={this.handleShowQr}>{tt('g.show')} QR</ButtonStyled>;
  }

  render() {
    const { pubkey, privateKey } = this.props;
    const { showPrivate, postingPrivateKey } = this.state;

    return (
      <Wrapper>
        <Flex>
          <KeyInfo>
            <Key showPrivate={showPrivate}>
              {showPrivate ? privateKey || postingPrivateKey : pubkey}
            </Key>
            <Hint>{this.renderHint()}</Hint>
          </KeyInfo>
        </Flex>
        <ButtonsWrapper>
          {this.renderButton()}
          {showPrivate || postingPrivateKey ? this.renderQRButton() : null}
        </ButtonsWrapper>
      </Wrapper>
    );
  }
}
