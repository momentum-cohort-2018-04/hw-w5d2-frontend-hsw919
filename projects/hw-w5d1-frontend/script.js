import request from 'superagent'
import math from 'mathjs'
import $ from 'jquery'

$(window).on('load', () => {
  request
    .get('http://fantasy-currency.glitch.me/rates')
    .then(response => {
      console.log(response)
    })
})

const PRECISION = 3
const EXPONENT = (10 ** PRECISION)

export class Money {
  constructor (amount, currencyCode) {
    const decimalAsStr = amount.toString().split('.')[1]
    if (decimalAsStr && decimalAsStr.length > PRECISION) {
      throw new Error('Maximum money precision is ' + PRECISION)
    }

    this._amount = amount * EXPONENT
    this.currencyCode = currencyCode
  }

  getAmount () {
    return this._amount / EXPONENT
  }

  plus (other) {
    this.checkCurrencyCodes(other)
    return new Money((this._amount + other._amount) / EXPONENT, this.currencyCode)
  }

  minus (other) {
    this.checkCurrencyCodes(other)
    return new Money((this._amount - other._amount) / EXPONENT, this.currencyCode)
  }

  times (number) {
    return new Money((this._amount * number) / EXPONENT, this.currencyCode)
  }

  checkCurrencyCodes (other) {
    if (this.currencyCode !== other.currencyCode) {
      throw new Error('Currency codes do not match')
    }
  }
}

export class Bank {
  constructor (rates) {
    this.rates = rates
  }

  // convertToUSD (money) {
  //   for (var rate of this.rates) {
  //     if (rate.abbr === money.currencyCode) {
  //       break
  //     }
  //   }
  //   return new Money(money.getAmount() * rate.rateInUSD, 'USD')
  // }

  convert (money, currencyCode) {
    if (money.currencyCode === currencyCode) {
      return money
    } else if (currencyCode === 'USD') {
      for (var rate of this.rates) {
        if (rate.abbr === money.currencyCode) {
          break
        }
      }
      return new Money(money.getAmount() * rate.rateInUSD, currencyCode)
    } else if (money.currencyCode === 'USD') {
      for (rate of this.rates) {
        if (rate.abbr === currencyCode) {
          break
        }
      }
      return new Money(math.round((1 / rate.rateInUSD) * money.getAmount(), 2), currencyCode)
    } else {
      for (rate of this.rates) {
        if (rate.abbr === money.currencyCode) {
          break
        }
      }
      for (var rate2 of this.rates) {
        if (rate2.abbr === currencyCode) {
          break
        }
      }
      return new Money(math.round((1 * rate.rateInUSD / rate2.rateInUSD) * money.getAmount(), 2), currencyCode)
    }
  }
}
