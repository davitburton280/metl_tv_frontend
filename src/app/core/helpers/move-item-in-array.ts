function moveItemInArray(arr, from, to){
    const f = arr.splice(from, 1)[0];
    arr.splice(to, 0, f);
    return arr;
}

export {moveItemInArray as moveItemInArray};
