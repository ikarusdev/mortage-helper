/*
 * Mortgage Helper
 * https://github.com/ikarusdev/mortgage-helper
 *
 * Copyright (c) 2019 Ikarus
 * Licensed under the MIT license.
 */

export default class HMortgage {
    constructor(principal, term, rate) {
        this.validate(principal, term, rate);
        this.principal = principal;
        this.term = term;
        this.rate = rate;
        this.initialize();
    }

    initialize() {
        /**
         * Your lender likely lists interest rates as an annual figure, 
         * so you’ll need to divide by 12, for each month of the year.
         * So, if your rate is 5%, then the monthly rate will look like 
         * this: 0.05/12 = 0.004167.
         */
        this.mInterestRate = (this.rate / 100) / 12;

        /** 
         * M = P [ i(1 + i)^n ] / [ (1 + i)^n - 1]
         * 
         * M = monthly mortgage payment
         * P = the principal amount
         * i = your monthly interest rate. 
         * n = the number of payments over the life of the loan.
         *     If you take out a 30-year fixed rate mortgage, this means: n = 30 years x 12 months per year, or 360 payments.
         **/
        const powed = Math.pow(1 + this.mInterestRate, this.term);
        this.mPayments = HMortgage.round(this.principal * ((this.mInterestRate * powed) / (powed - 1)));
    }

    validate(principal, term, rate) {
        if ( !principal || principal <= 0) {
            throw new Error(`Bad parameter principal: ${principal}` );
        } else if ( !term || term <= 0) {
            throw new Error(`Bad parameter term: ${term}` );
        } else if ( !rate || rate <= 0) {
            throw new Error(`Bad parameter rate: ${rate}` );
        }
    }

    amortize() {
        let amortized = {
            principal: [],
            interests: [],
            balance: []
        };

        let sum = 0;
        for (let i = 0; i < this.term; i++) {
            let next = this.getNextValues(sum);

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

    getNextValues(sum){
        const interest = HMortgage.round((this.principal - sum) * this.mInterestRate);
        const principal = this.mPayments - interest;
  
        return {
            interest,
            principal,
            balance: this.principal - sum - principal
        };
    }
    
    getMonthlyInterestRate(){
        return this.mInterestRate;
    }

    getMonthlyPayment() {
        return this.mPayments;
    }

    static round (num) {
        return Math.round(num * 100) / 100;
    }
}