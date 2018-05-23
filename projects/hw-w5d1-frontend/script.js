import request from 'superagent'
import math from 'mathjs'
import $ from 'jquery'

$(window).on('load', () => {
  request
    .get('http://fantasy-currency.glitch.me/rates')
    .then(response => {
      console.log(response)
      $('#form').on('submit', (event) => {
        event.preventDefault()
        const number = $('#from-number').val()

        if (number === '' || isNaN(number) === true || number === '0') {
          console.log('is empty or nan')
          $('.danger').html('You must enter a valid number that is greater than 0')
          $('.total-contain').html('')
        } else {
          $('.danger').html('')
          const fromCode = $('#from-code').val()
          const fromCodeSplit = fromCode.split(' ')

          const toCode = $('#to-code').val()
          const toCodeSplit = toCode.split(' ')

          const bank = new Bank(response.body.rates)
          const money = new Money(number, fromCodeSplit[0])

          const subtotal = bank.convert(money, toCodeSplit[0])
          const num = subtotal._amount / EXPONENT
          // $('.subtotal').html(`Subtotal: ${num}`)

          const total = math.round((1 - 0.02) * num, 2)
          // $('.total').html(`Total: ${total} ${toCodeSplit[0]}`)

          const fee = math.round(num % total, 2)
          // $('.fee').html(`Tax: ${fee}`)

          $('.total-contain').html(`
          <div class="subtotal">Subtotal: ${num}</div>
          <div class="fee">Tax: ${fee}</div>
          <div class="total">Total: ${total} ${toCodeSplit[0]}</div>
          `)
        }
      })
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

  convert (money, currencyCode) {
    if (money.currencyCode === currencyCode) {
      return money
    } else if (currencyCode === 'USD') {
      for (var rate of this.rates) {
        if (rate.abbr === money.currencyCode) {
          break
        }
      }
      return new Money(math.round(money.getAmount() * rate.rateInUSD, 2), currencyCode)
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
