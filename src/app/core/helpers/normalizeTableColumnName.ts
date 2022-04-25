function normalizeColName(col): string {
    col = `${col[0].toUpperCase()}${col.slice(1)}`.replace(/([A-Z])/g, ' $1').trim();
    return col.replace(/_/g, ' ');
}

export {normalizeColName as normalizeColName};
