/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.yeonhwandev.com",
  generateRobotsTxt: true,
  exclude: ["/server-sitemap.xml"],
  robotsTxtOptions: {
    additionalSitemaps: ["https://yeonhwandev.com/server-sitemap.xml"],
  },
  changeFreq: "daily",
  priority: 1,
};
