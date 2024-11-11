import mongoose from 'mongoose';

// 스키마 만들기
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
    },
    description: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    // 두번째 파라미터(timestamps: 생성 및 수정필드 자동생성)
    timestaps: true
  }
);

// model 정의
  // 첫번째 아규먼트는 첫글자를 대문자로 작성
    // mongoDB에서 다룰 컬렉션 이름 = 'Task'
      // 'Task'를 통해 tasks에 CRUD 함. 
const Task = mongoose.model('Task', TaskSchema); // model은 스키마를 기반으로 CRUD 가능한 인터페이스

export default Task;