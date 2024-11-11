import mongoose from 'mongoose';
import data from './mock.js';
import Task from '../models/Task.js';
import * as dotenv from 'dotenv';
dotenv.config();

//독립 실행 코드 작성
mongoose.connect(process.env.MONGO_URL);

// 비동기
  // mongoDB나 NoSQL에 사용되는 메서드
await Task.deleteMany({}); // 조건에 맞는 문서를 전부다 삭제 (사용 시 주의)
await Task.insertMany(data); // 대량의 데이터를 추가할 때 유용함.

// 이거는 한번 실행되고 끝나는 프로그램이라서 커넥션을 종료.
mongoose.connection.close();