// const admin = require('firebase-admin');
// const fs = require('fs');
// const serviceAccount = require('./appConfig.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// const db = admin.firestore();
// const chatRef = db.collection('chat');
// const chatsData = [];
// const individualData = [];

// chatRef.get()
//   .then(snapshot => {
//       snapshot.forEach(doc => {
//       const individualChatRef = db.collection(`chat/${doc.id}/individualChat`);
//       individualChatRef.get()
//         .then(individualSnapshot => {
//           console.log("individualSnapshot length is ---> ", individualSnapshot.length);
//           individualSnapshot.forEach(individualDoc => {
//               console.log({ id: doc.id, ...individualDoc.data() });
//               individualData.push({ cId: doc.id,id:individualDoc.id, ...individualDoc.data() })
//           });
//           const jsonData = JSON.stringify(individualData, null, 2);
//           fs.writeFile('individualchat.json', jsonData, (err) => {
//             if (err) {
//               console.error('Error writing file', err);
//             } else {
//               console.log('Data exported to chats.json');
//             }
//           });

//         })
//         .catch(err => {
//           console.error('Error getting individualChat documents', err);
//         });
//       chatsData.push({ id: doc.id, ...doc.data() });
//     });

//   })
//   .catch(err => {
//     console.error('Error getting documents', err);
//   });

const fs = require("fs");

const readJsonFileData = (filePath) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }
    try {
      const roomData = JSON.parse(data);
      fs.readFile("./individualChat.json", "utf8", (err, data) => {
        const individualChat = JSON.parse(data);
        const mappedData = individualChat.map((item, index) => {
          const findRoom = roomData.find(({ id }) => id === item.cId);
          const users = Object.keys(findRoom.users);
          const senderId = item.user;
          const receiverId = users.find((id) => id !== item.user);
          return {
            messages: {
              [index]: {
                id: index,
                muid: item.id,
                sender: senderId,
                receiverType: "user",
                receiver: receiverId,
                type: "text",
                category: "message",
                data: {
                  text: item.message,
                  attachments: [],
                  metad2ata: {},
                  custodata: {},
                },
                sentAt: item.createdAt,
                deliveredAt: item.createdAt,
                readAt: item.createdAt,
                tags: [],
              },
            },
          };
        });
        // storing data in JSON file 
        const jsonChatData = JSON.stringify(mappedData, null, 2);
        fs.writeFile("cometChatEquvalenChatMessage.json", jsonChatData, (err) => {
          if (err) {
            console.error("Error writing file", err);
          } else {
            console.log("Data exported to chats.json");
          }
        });


      });
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
  });
};

const fetchData = () => {
  readJsonFileData("./backup.json");
};
fetchData();
