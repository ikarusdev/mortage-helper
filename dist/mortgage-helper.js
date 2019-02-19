'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mortgage = function () {
    'use strict';

    var HMortgage = function () {
        function HMortgage(amount, term, rate) {
            _classCallCheck(this, HMortgage);

            this.validate(amount, term, rate);
            this.amount = amount;
            this.term = term;
            this.rate = rate;
        }

        _createClass(HMortgage, [{
            key: 'validate',
            value: function validate(amount, term, rate) {
                if (!amount || amount <= 0) {
                    throw new Error('Bad parameter amount: ' + amount);
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

                    sum += next.capital;

                    if (i === this.term - 1) {
                        sum += next.remain;
                        next.remain = 0;
                    }

                    amortized.principal.push(next.capital);
                    amortized.balance.push(next.remain);
                    amortized.interests.push(next.interest);
                }

                return amortized;
            }
        }, {
            key: 'getNextValues',
            value: function getNextValues(sum) {
                var capital = void 0;
                var interest = void 0;
                var installment = void 0;
                var ratePerMonth = this.rate / (12 * 100);

                var irmPow = Math.pow(1 + ratePerMonth, this.term);
                installment = HMortgage.round(this.amount * (ratePerMonth * irmPow / (irmPow - 1)));
                interest = HMortgage.round((this.amount - sum) * ratePerMonth);
                capital = installment - interest;

                return {
                    capital: capital,
                    interest: interest,
                    remain: this.amount - sum - capital
                };
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
