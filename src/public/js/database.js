// const mysql = require('mysql');
// const connection = mysql.createConnection({
//     host : '127.0.0.1',
//     user : 'root',
//     password : '',
//     database : 'node'
// });

// connection.connect(); // mysql 에 연결

// let insert = 'SELECT * from users';

// connection.query(insert, (err , rows , fields) => {
//     // sql 문에 해당하는 행을 rows가 받음
//     if(err) {
//         throw err
//     };
//     console.log("User info is : ", rows);
// });
// console.log("성공");
// connection.end(); // 연결 해제