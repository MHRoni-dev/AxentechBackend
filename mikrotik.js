const RouterOS = require('node-routeros').RouterOSAPI;

// const conn = new RouterOS({
//   timeout: 30,
//   keepalive : true,

// })

let connection;

async function connectToMikroTik() {
  if (connection) return connection; // Reuse existing connection

  connection = new RouterOS({
    host: process.env.MIKROTIK_HOST || '192.168.0.1',
    user: process.env.MIKROTIK_USER || 'admin',
    password: process.env.MIKROTIK_PASSWORD || 'password',
    port: process.env.MIKROTIK_PORT || 8728,
    keepalive: true,
    timeout: 30

  });

  try {
    await connection.connect();
    console.log('✅ Connected to MikroTik router successfully');
  } catch (error) {
    console.error('❌ Error connecting to MikroTik router:', error);
    connection = null; // Reset the connection
    setTimeout(connectToMikroTik, 5000); // Retry connection after 5 seconds
  }

  return connection;
}

async function getConnection() {
  if (!connection) await connectToMikroTik();
  return connection;
}

// Close connection on server shutdown
function closeConnection() {
  if (connection) {
    connection.close();
    console.log('🔌 Connection to MikroTik router closed.');
  }
}

module.exports = {
  getConnection,
  closeConnection
};


// conn.connect().then((conn) => {
//   console.log('Logged in successfully');
  
  
//   conn.write('/ip/hotspot/user/print')
//     .then((data) => {
//       data.forEach((user) => {
//         if(user.name == "807") console.log(user)
//       })
//       // conn.close(); 
//     })
//     .catch((err) => {
//       console.error('Error sending command:', err);
//     });
// })
// .catch((err) => {
//   console.error('Failed to connect:', err);
// });
