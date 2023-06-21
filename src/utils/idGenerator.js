// idGenerator.js
import { storage } from '@/utils/index.ts'
import GenId from 'cherry-id';

export function genId(name = 'userId',workerId = 1, seqBitLength = 14) {
  let generatedId = null;
  let resultId  = storage.getItem(name);
  if (!resultId) {
    // 生成唯一的 ID
    generatedId = new GenId({ WorkerId: workerId, SeqBitLength: seqBitLength })
    resultId = generatedId.NextId().toString();
    storage.setItem(name, resultId);
  }

  return resultId;
}
