
async function convertToTimestamp(time){
    var datum = Date.parse(time);
    return datum/1000;
    console.log(datum/1000);
    console.log(Math.floor(Date.now() / 1000))
}

export default convertToTimestamp;