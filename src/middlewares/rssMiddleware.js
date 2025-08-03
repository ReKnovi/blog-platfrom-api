const NodeCache = require("node-cache");
const rssCache = new NodeCache({ stdTTL: 3600 });

const invalidateRSSCache = (req, res, next) => {
  rssCache.flushAll();
  console.log("RSS cache invalidated");
  next();
};

const setRSSHeaders = (req, res, next) => {
  res.set({
    "Content-Type": "application/rss+xml; charset=UTF-8",
    "Cache-Control": "public, max-age=3600",
  });
  next();
};

const validateRSSParams = (req, res, next) => {
  const { limit } = req.query;
  if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
    return res.status(400).json({
      success: false,
      message: "Limit must be between 1 and 100",
    });
  }
  next();
};

module.exports = {
  invalidateRSSCache,
  setRSSHeaders,
  validateRSSParams,
  rssCache,
};
