
const asyncHandler = (fn) =>(req, res, next) =>{
    Promise.resolve(fn(req, res, next))
    .catch(err => console.log("Error : " + err))
}

export {asyncHandler}