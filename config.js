const fs = require("fs");

module.exports = {
	mogodb_uri: process.env.MONGODB_URI === undefined ? '' : process.env.MONGODB_URI,
	log_grp: process.env.LOG_GRP === undefined ? '' : process.env.LOG_GRP,
	wa_grp: process.env.WA_GRP === undefined ? '' : process.env.WA_GRP,
	wa_grp_m: process.env.WA_GRP_M === undefined ? '' : process.env.WA_GRP_M,
	wa_grp_id: process.env.WA_GRP_ID === undefined ? '' : process.env.WA_GRP_ID,
	m_wa_grp_id: process.env.M_WA_GRP_ID === undefined ? '' : process.env.M_WA_GRP_ID,
	app_name: process.env.APP_NAME === undefined ? '' : process.env.APP_NAME,
  };
