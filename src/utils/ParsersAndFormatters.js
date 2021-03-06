import tt from 'counterpart';
import { has } from 'ramda';

import { CURRENCIES } from 'shared/constants';
import { func } from 'prop-types';

export function parsePayoutAmount(amount) {
  return parseFloat(String(amount));
}

/**
    This is a rough approximation of log10 that works with huge digit-strings.
    Warning: Math.log10(0) === NaN
    The 0.00000001 offset fixes cases of Math.log(1000)/Math.LN10 = 2.99999999~
*/
function log10(str) {
  const leadingDigits = parseInt(str.substring(0, 4));
  const log = Math.log(leadingDigits) / Math.LN10 + 0.00000001;
  const n = str.length - 1;
  return n + (log - parseInt(log));
}

export const repLog10 = rep2 => {
  if (!rep2) {
    return rep2;
  }

  let rep = String(rep2);
  const neg = rep.charAt(0) === '-';
  rep = neg ? rep.substring(1) : rep;

  let out = log10(rep);
  if (isNaN(out)) {
    out = 0;
  }
  out = Math.max(out - 9, 0); // @ -9, $0.50 earned is approx magnitude 1
  out = (neg ? -1 : 1) * out;
  out = out * 9 + 25; // 9 points per magnitude. center at 25
  // base-line 0 to darken and < 0 to auto hide (grep rephide)
  out = parseInt(out);

  return out;
};

// this function searches for right translation of provided error (usually from back-end)
export function translateError(string) {
  if (typeof string !== 'string') {
    return string;
  }

  switch (string) {
    case 'Account not found':
      return tt('g.account_not_found');
    case 'Incorrect Password':
      return tt('g.incorrect_password');
    case 'Username does not exist':
      return tt('g.username_does_not_exist');
    case 'Account name should be longer.':
      return tt('g.account_name_should_be_longer');
    case 'Account name should be shorter.':
      return tt('g.account_name_should_be_shorter');
    case 'Account name should start with a letter.':
      return tt('g.account_name_should_start_with_a_letter');
    case 'Account name should have only letters, digits, or dashes.':
      return tt('g.account_name_chars_restrictions');
    case 'vote currently exists, user must be indicate a desire to reject witness':
      return tt('g.vote_currently_exists_user_must_be_indicate_a_to_reject_witness');
    case 'Only one Steem account allowed per IP address every 10 minutes':
      return tt('g.ip_access_limit');
    case 'Cannot increase reward of post within the last minute before payout':
      return tt('g.increase_post_reward_time_limit');
    default:
      return string;
  }
}

//  Missing Active Authority gsteem
// copypaste from https://gist.github.com/tamr/5fb00a1c6214f5cab4f6
// (it have been modified: ий > iy and so on)
// this have been done beecause we cannot use special symbols in url (`` and '')
// and url seems to be the only source of thruth

const rus = 'щ    ш  ч  ц  й  ё  э  ю  я  х  ж  а б в г д е з и к л м н о п р с т у ф ъ  ы ь ґ є і ї'.split(
  /\s+/
);
const eng = 'shch sh ch cz ij yo ye yu ya kh zh a b v g d e z i k l m n o p r s t u f xx y x g e i i'.split(
  /\s+/
);

export function detransliterate(str, reverse) {
  if (!str) {
    return str;
  }

  if (!reverse) {
    if (str.substring(0, 4) !== 'ru--') {
      return str;
    }
    str = str.substring(4);
  }

  // TODO rework this
  // (didnt placed this earlier because something is breaking and i am too lazy to figure it out ;( )
  if (!reverse) {
    //    str = str.replace(/j/g, 'ь')
    //    str = str.replace(/w/g, 'ъ')
    str = str.replace(/yie/g, 'ые');
  } else {
    //    str = str.replace(/ь/g, 'j')
    //    str = str.replace(/ъ/g, 'w')
    str = str.replace(/ые/g, 'yie');
  }

  const s = /[^[\]]+(?=])/g;
  const orig = str.match(s);
  const t = /<(.|\n)*?>/g;
  const tags = str.match(t);

  if (reverse) {
    for (let i = 0; i < rus.length; ++i) {
      str = str.split(rus[i]).join(eng[i]);
      str = str.split(rus[i].toUpperCase()).join(eng[i].toUpperCase());
    }
  } else {
    for (let i = 0; i < rus.length; ++i) {
      str = str.split(eng[i]).join(rus[i]);
      str = str.split(eng[i].toUpperCase()).join(rus[i].toUpperCase());
    }
  }

  if (orig) {
    const restoreOrig = str.match(s);

    for (let i = 0; i < restoreOrig.length; ++i) {
      str = str.replace(restoreOrig[i], orig[i]);
    }
  }

  if (tags) {
    const restoreTags = str.match(t);

    for (let i = 0; i < restoreTags.length; ++i) {
      str = str.replace(restoreTags[i], tags[i]);
    }

    str = str.replace(/[\[\]]/g, '');
  }

  return str;
}

export const validateTransferQuery = query => {
  if (
    has('dialog', query) &&
    query.dialog === 'transfer' &&
    has('to', query) &&
    has('amount', query) &&
    has('token', query)
  ) {
    const to = query.to.toLowerCase();

    let token = '';
    const upperCaseToken = query.token.toUpperCase();
    if (/\b(GOLOS|CYBER)\b/.test(upperCaseToken)) {
      token = upperCaseToken;
    }

    let amount = '';
    if (token && /^[0-9]+(?:\.[0-9]+)?$/.test(query.amount)) {
      amount = parseFloat(query.amount.replace(/\s+/, '')).toFixed(CURRENCIES[token].decs);
    }

    let memo = '';
    if (has('memo', query)) {
      // eslint-disable-next-line prefer-destructuring
      memo = query.memo;
    }

    return {
      to,
      amount,
      token,
      memo,
    };
  }

  return null;
};

export function humanizePercent(value) {
  return (value / 100).toFixed(2).replace(/\.0+$/, '');
}
