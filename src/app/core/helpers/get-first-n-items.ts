function getFirstNItems(items, n){
    return items.filter((st, index) => index < n);
}

export {getFirstNItems as getFirstNItems};
