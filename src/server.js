import Express from 'express';
import Cluster from 'cluster';
import Os from 'os';

const app = Express();
const PORT = 5000;
const numCpu = Os.cpus().length;

app.get('/', (request, response, next) => {
  for (let i = 0; i < 1e8; i++) {
    // some long running task
  }

  response.send(`Ok... ${process.pid}`);
  Cluster.worker.kill();
})

if (Cluster.isMaster) {
  for (let i = 0; i < numCpu; i++) {
    Cluster.fork()
  }
  Cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    Cluster.fork();
  })
} else {
  app.listen(PORT, function () {
    console.log(`🚀 server ${process.pid} @ http://localhost:${PORT}/`)
  })
}
