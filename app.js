import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Task from  './models/Task.js';
import cors from 'cors';

dotenv.config();

function asyncHandler(handelr) {
  return async function(req, res) {
    try {
      await handelr(req, res);
    } catch (e) {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message});
      } else if (e.name === 'CastError') {
        res.status(404).send({ message: e.message});
      } else {
        res.status(500).send({ message: e.message});
      }
    }
  }
};


const app = express();

//POST 파싱
app.use(express.json()); // 앱 전체에서 json 사용
app.use(cors());

app.get('/tasks', asyncHandler(async (req, res)=> { // (req,res) -> 콜백함수
  /**
   * 쿼리파라미터
   * - sort: 'oldest'인 경우 오랜된 태스크 기준, 나머지는 최신 기준
   * - count: 태스크 개수
   */
  const sort = req.query.sort;
  const count = Number(req.query.count) || 0; // 문자열이기 때문에 정수형으로 변환하기

  // Task
  const sortOption = {
    createdAt: sort==='oldest' ? 'asc' : 'desc'
   };

  // Task에서 모든객체를 가져오기 + sortOption
   // awiat 으로 결과값 -> Task 배열
  const tasks = await Task.find().sort(sortOption).limit(count); // 쿼리 + 쿼리 + 쿼리 === 쿼리

   res.send(tasks);
  /* model 사용 전 코드
  // 비교 함수
  const compareFn = 
    sort === 'oldest'
      ? (a, b) => a.createdAt - b.createdAt // 오름차순
      : (a, b) => b.createdAt - a.createdAt; // 내림차순

  let newTasks = mockTasks.sort(compareFn);

  if (count) {
    newTasks = newTasks.slice(0, count);
  }

  // 아큐먼트로 JS객체를 받으면, json으로 변환해서 돌려줌
  // json데이터는 항상 큰따옴표("")로 설정되어있음.
  res.send(newTasks); 
  */
}));

// 다이나믹 URL 정의하기 / :id -> 라우트

app.get('/tasks/:id', asyncHandler(async (req,res) => { // DB에서 불러오는 작업은 대부분 비동기!
  const id = req.params.id; 
  
  // model.findById(): promise처럼 동작방식이 비슷하고, query를 반환
    // promise 차이점 -> query는 뒤에 메소드 추가가능
  const task = await Task.findById(id); // MongoDB에서 사용하는 ID는 문자열!!
  
  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
}));


// POST : JSON을 -> JS객체로 변환이 필요(파싱).
app.post('/tasks', asyncHandler(async (req, res) => {
  const newTask = await Task.create(req.body);
  res.status(201).send(newTask);
}));


//PATCH
app.patch('/tasks/:id', asyncHandler(async (req,res) => {
  const id = req.params.id;
  const task = await Task.findById(id);
  
  if (task) {
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    })
    await task.save();
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
}));


// DELETE (URL -> req.params 사용)
app.delete('/tasks/:id', asyncHandler(async (req,res) => {
  const id = req.params.id; 
  const task = await Task.findByIdAndDelete(id);
  
  if (task) {
    res.sendStatus(204); // 상태코드만 출력
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
}));

// mongoose 연결
mongoose.connect(process.env.MONGO_URL).then(() => console.log('Connected to DB'));

// 3000포트로 설정
app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
