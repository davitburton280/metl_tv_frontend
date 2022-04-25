function updateStockDetails(userStocks, currentStocks) {
    userStocks.map(st => {
        const found = currentStocks.find(fs => fs.name === st.name);
        if (found) {
            st.change = found.change;
            st.changesPercentage = found.changesPercentage;
            st.price = found.price;
            return st;
        }
    });
    return userStocks;
}

export {updateStockDetails as updateStockDetails};
