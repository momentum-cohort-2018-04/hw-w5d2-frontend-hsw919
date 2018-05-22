/* globals test, expect */

import {Money, Bank} from './script'

var BANK = [
  {
    'abbr': 'NLN',
    'name': 'Narnia Lion',
    'rateInUSD': 3.95
  },
  {
    'abbr': 'GCA',
    'name': 'Gondor Castar',
    'rateInUSD': 6.21
  },
  {
    'abbr': 'WGA',
    'name': 'Wizard Galleon',
    'rateInUSD': 4.47
  },
  {
    'abbr': 'FRC',
    'name': 'Forgotten Realms Copper',
    'rateInUSD': 0.36
  },
  {
    'abbr': 'AMD',
    'name': 'Ankh-Morpork Dollar',
    'rateInUSD': 0.85
  },
  {
    'abbr': 'FPB',
    'name': 'Flanian Pobble Bead',
    'rateInUSD': 0.15
  },
  {
    'abbr': 'VTH',
    'name': 'Vampire Teeth',
    'rateInUSD': 26.09
  }
]

// Given a Money object and the same currency code
// as that money, it should return the same amount
// of money.

test('can take 1 USD and return the same thing in USD', () => {
  const money = new Money(1, 'USD')
  const bank = new Bank([])
  expect(bank.convert(money, 'USD')).toEqual(new Money(1, 'USD'))
})

// Given a Money object and the currency code of USD, it should return
// the correct amount of money in USD.

test('can take 1 GCA and convert it to USD', () => {
  const money = new Money(1, 'GCA')
  const bank = new Bank(BANK)
  expect(bank.convert(money, 'USD')).toEqual(new Money(6.21, 'USD'))
})

// Given a Money object with the currency code of USD and any other
// currency code to convert to, it should return the correct
// amount of money.

test('can take 1 USD and convert it to NLN', () => {
  const money = new Money(1, 'USD')
  const bank = new Bank(BANK)
  expect(bank.convert(money, 'NLN')).toEqual(new Money(0.25, 'NLN'))
})

// Given a Money object and a currency code to convert to, neither of
// which are in USD, it should return the correct amount of money.

test('can take NLN and convert it to GCA', () => {
  const money = new Money(1, 'NLN')
  const bank = new Bank(BANK)
  expect(bank.convert(money, 'GCA')).toEqual(new Money(0.64, 'GCA'))
})
