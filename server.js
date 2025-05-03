const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = process.env.PORT || 4000;
const HOST = '0.0.0.0'; 

connectDB().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${getLocalIP()}:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Server failed to start:', err);
});

function getLocalIP() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}
