/* eslint-env jest */
import HMortgage from "./mortgage-helper";

test("HMortgage is defined", () => {
    expect(HMortgage).toBeDefined();
});

test("should be the right monthly amounts", () => {
    const mortgage = new HMortgage(250000, 15 * 12, 3.49);
    expect(mortgage.getMonthlyPayment()).toBe(1785.98);
    expect(mortgage.getMonthlyInterestRate()).toBe(0.0029083333333333335);
});

test("should have amortization", () => {
    const amortized = new HMortgage(250000, 15 * 12, 3.49, false).amortize();

    expect(amortized).toBeDefined();

    expect(amortized.principal.length).toBe(15 * 12);
    expect(amortized.balance.length).toBe(15 * 12);
    expect(amortized.interests.length).toBe(15 * 12);

    expect(amortized.principal[0]).toBe(1058.9);
    expect(amortized.balance[0]).toBe(248941.1);
    expect(amortized.interests[0]).toBe(727.08);

    const lastIndex = (15 * 12) - 1;
    expect(amortized.balance[lastIndex]).toBe(0);
});

test("should throw on wrong principal", () => {
    expect(() => new HMortgage(undefined)).toThrowError("Bad parameter principal: undefined");
});

test("should throw on wrong term", () => {
    expect(() => new HMortgage(250000, undefined)).toThrowError("Bad parameter term: undefined");
});

test("should throw on wrong rate", () => {
    expect(() => new HMortgage(250000, 15 * 12, undefined)).toThrowError("Bad parameter rate: undefined");
});
