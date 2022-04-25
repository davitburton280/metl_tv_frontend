function checkEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export {checkEmpty as checkIfObjectEmpty};
