
var pool = require("mysql").createPool({
	connectionLimit: 10,
	host: "localhost",
	user: "hphan",
	password: "ken26861",
	database: "dkmp3"
})

function executeQuery(sql, values) {
	return new Promise(function(fulfill, reject) {
		pool.query(sql, values, function(err, result) {
			if (err) reject(err);
			else fulfill(result);
		})
	})
}

exports.mount = function(app) {
	app.get("/diepkhuc-mp3/search", function(req, res) {
		var query = (req.query.query || "").trim();
		var orderBy = req.query.orderBy || "songName ASC";
		var offset = req.query.offset || 0;
		var limit = req.query.limit || 20;

		if (!/^(id|hits|lastPlayed|songName)\s(ASC|DESC)$/.test(orderBy)) {
			res.status(400).json({message: "Bad orderBy"});
			return;
		}
		if (!/^\d+$/.test(offset)) {
			res.status(400).json({message: "Bad offset"});
			return;
		}
		if (!/^\d+$/.test(limit)) {
			res.status(400).json({message: "Bad limit"});
			return;
		}

		var values = [];
		var from = "mp3 ";
		var where = "size>1 ";
		if (query) {
			values = query.split(/\s+/);
			for (var i=0; i<values.length; i++) {
				from += `INNER JOIN tags t${i} USING (id) `;
				where += `AND t${i}.tag=? `;
			}
		}

		Promise.all([
			executeQuery(`SELECT COUNT(*) AS count FROM ${from} WHERE ${where}`, values),
			executeQuery(`SELECT * FROM ${from} WHERE ${where} ORDER BY ${orderBy} LIMIT ${offset}, ${limit}`, values)
		])
		.then(function(results) {
			res.json({
				count: results[0].count,
				items: results[1]
			})
		})
		.catch(function(err) {
			console.log(err);
		})
	})
}
