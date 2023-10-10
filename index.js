const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('./appConfig.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const chatRef = db.collection('chat');
const chatsData = [];
const individualData = [];

chatRef.get()
  .then(snapshot => {
      snapshot.forEach(doc => {
      const individualChatRef = db.collection(`chat/${doc.id}/individualChat`);
      individualChatRef.get()
        .then(individualSnapshot => {
          console.log("individualSnapshot length is ---> ", individualSnapshot.length);
          individualSnapshot.forEach(individualDoc => {
              console.log({ id: doc.id, ...individualDoc.data() });
              individualData.push({ cId: doc.id,id:individualDoc.id, ...individualDoc.data() })
          });
          const jsonData = JSON.stringify(individualData, null, 2);
          fs.writeFile('individualchat.json', jsonData, (err) => {
            if (err) {
              console.error('Error writing file', err);
            } else {
              console.log('Data exported to chats.json');
            }
          });
            
        })
        .catch(err => {
          console.error('Error getting individualChat documents', err);
        });
      chatsData.push({ id: doc.id, ...doc.data() });
    });
    
  })
  .catch(err => {
    console.error('Error getting documents', err);
  });
