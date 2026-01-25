const redis = require("../utils/redisClient");

const ratelimiter=({windowSec,maxRequests,keyPrefix})=>{ 
    return async(req,res,next)=>{ 
        const identifier=req.user?.id||req.ip;
        const key=`${keyPrefix}:${identifier}`;
        
        const count=await redis.incr(key);

        if(count==1)await redis.expire(key,windowSec);

        if(count>maxRequests){ return res.status(429).json({error: "Too many transform requests"}); }

        next();
    }
}
module.exports=ratelimiter;