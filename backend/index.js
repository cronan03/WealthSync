// const express = require('express');
// const app = express();
// const port = 3000;
// const mongoose = require('mongoose') at

// const mongoURI = 'mongodb://vidit:password_123@ac-munnlo7-shard-00-00.g08oqga.mongodb.net:27017,ac-munnlo7-shard-00-01.g08oqga.mongodb.net:27017,ac-munnlo7-shard-00-02.g08oqga.mongodb.net:27017/?ssl=true&replicaSet=atlas-yirhrv-shard-0&authSource=admin&retryWrites=true&w=majority';

// mongoose.connect(mongoURI)
//   .then(() => {
//     console.log('Connected to MongoDB');
//     // Start the server after successful MongoDB connection
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   })
//   .catch(err => {
//     console.error('Error connecting to MongoDB:', err);
//   });

const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

const mongoURI = 'mongodb://vidit:password_123@ac-munnlo7-shard-00-00.g08oqga.mongodb.net:27017,ac-munnlo7-shard-00-01.g08oqga.mongodb.net:27017,ac-munnlo7-shard-00-02.g08oqga.mongodb.net:27017/Portfolio?ssl=true&replicaSet=atlas-yirhrv-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Increase server selection timeout
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
