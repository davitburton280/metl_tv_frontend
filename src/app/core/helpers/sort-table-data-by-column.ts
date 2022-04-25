function sortTableData(data, col, direction) {
    data.sort((a, b) => {
        const sortOrder = direction === 'desc' ? -1 : 1;
        const valueA = a[col];
        const valueB = b[col];

        const result = (valueA < valueB) ? -1 : (valueA > valueB) ? 1 : 0;
        return result * sortOrder;
    });
    return data;
}

export {sortTableData as sortTableData};
