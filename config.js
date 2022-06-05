const fs = require("fs");

module.exports = {
	mogodb_uri: process.env.MONGODB_URI === undefined ? 'mongodb+srv://fazilvk:fazo13579@cluster0.68e21.mongodb.net/?retryWrites=true&w=majority' : process.env.MONGODB_URI,
	log_grp: process.env.LOG_GRP === undefined ? '919072292864@s.whatsapp.net' : process.env.LOG_GRP,
	wa_grp: process.env.WA_GRP === undefined ? 'fazil' : process.env.WA_GRP,
	wa_grp_m: process.env.WA_GRP_M === undefined ? 'fazil' : process.env.WA_GRP_M,
	wa_grp_id: process.env.WA_GRP_ID === undefined ? '120363041772870155@g.us' : process.env.WA_GRP_ID,
	m_wa_grp_id: process.env.M_WA_GRP_ID === undefined ? '120363041772870155@g.us' : process.env.M_WA_GRP_ID,
	app_name: process.env.APP_NAME === undefined ? 'somename' : process.env.APP_NAME,
  };
