function CleanNumber(amount, decimals = 18) {

    numerator = new BigNumber(amount);
    denominator = new BigNumber(10 ** decimals);

    cleanNum = numerator.dividedBy(denominator).toString();
    cleanNum = Number(cleanNum).toFixed(2);
    cleanNum = cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return cleanNum

}