const db = require("../db-setup");

module.exports.getTemperaturesForDevice = function (deviceId, time) {
  const stmt = db.prepare(`SELECT * FROM temperatures WHERE deviceId = ?
  AND time >= strftime('%Y-%m-%d %H:%M:%S', 'now', '${time}')
  ORDER BY time DESC
  `);

  return new Promise((resolve, reject) => {
    stmt.all(deviceId, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports.addTemperature = function (value, time, deviceId) {
  const stmt = db.prepare(
    `INSERT INTO temperatures (value, time, deviceId) VALUES (?, ?, ?)`
  );

  stmt.run(value, time, deviceId);
};

module.exports.deleteTemperatures = function (deviceId) {
  const stmt = db.prepare(`DELETE FROM temperatures WHERE deviceId = ?`);

  stmt.run(deviceId);
};