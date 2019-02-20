'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hmortgage = function () {
    'use strict';

    /*
     * Mortgage Helper
     * https://github.com/ikarusdev/mortgage-helper
     *
     * Copyright (c) 2019 Ikarus
     * Licensed under the MIT license.
     */

    var HMortgage = function () {
        function HMortgage(principal, term, rate) {
            _classCallCheck(this, HMortgage);

            this.validate(principal, term, rate);
            this.principal = principal;
            this.term = term;
            this.rate = rate;
            this.initialize();
        }

        _createClass(HMortgage, [{
            key: 'initialize',
            value: function initialize() {
                /**
                 * Your lender likely lists interest rates as an annual figure, 
                 * so you’ll need to divide by 12, for each month of the year.
                 * So, if your rate is 5%, then the monthly rate will look like 
                 * this: 0.05/12 = 0.004167.
                 */
                this.mInterestRate = this.rate / 100 / 12;

                /** 
                 * M = P [ i(1 + i)^n ] / [ (1 + i)^n - 1]
                 * 
                 * M = monthly mortgage payment
                 * P = the principal amount
                 * i = your monthly interest rate. 
                 * n = the number of payments over the life of the loan.
                 *     If you take out a 30-year fixed rate mortgage, this means: n = 30 years x 12 months per year, or 360 payments.
                 **/
                var powed = Math.pow(1 + this.mInterestRate, this.term);
                this.mPayments = HMortgage.round(this.principal * (this.mInterestRate * powed / (powed - 1)));
            }
        }, {
            key: 'validate',
            value: function validate(principal, term, rate) {
                if (!principal || principal <= 0) {
                    throw new Error('Bad parameter principal: ' + principal);
                } else if (!term || term <= 0) {
                    throw new Error('Bad parameter term: ' + term);
                } else if (!rate || rate <= 0) {
                    throw new Error('Bad parameter rate: ' + rate);
                }
            }
        }, {
            key: 'amortize',
            value: function amortize() {
                var amortized = {
                    principal: [],
                    interests: [],
                    balance: []
                };

                var sum = 0;
                for (var i = 0; i < this.term; i++) {
                    var next = this.getNextValues(sum);

                    sum += next.principal;

                    if (i === this.term - 1) {
                        sum += next.balance;
                        next.balance = 0;
                    }

                    amortized.principal.push(next.principal);
                    amortized.interests.push(next.interest);
                    amortized.balance.push(next.balance);
                }

                return amortized;
            }
        }, {
            key: 'getNextValues',
            value: function getNextValues(sum) {
                var interest = HMortgage.round((this.principal - sum) * this.mInterestRate);
                var principal = this.mPayments - interest;

                return {
                    interest: interest,
                    principal: principal,
                    balance: this.principal - sum - principal
                };
            }
        }, {
            key: 'getMonthlyInterestRate',
            value: function getMonthlyInterestRate() {
                return this.mInterestRate;
            }
        }, {
            key: 'getMonthlyPayment',
            value: function getMonthlyPayment() {
                return this.mPayments;
            }
        }], [{
            key: 'round',
            value: function round(num) {
                return Math.round(num * 100) / 100;
            }
        }]);

        return HMortgage;
    }();

    return HMortgage;
}();
