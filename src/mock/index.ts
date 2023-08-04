import type { MockParams } from './types';
import Mock from 'mockjs';
import user from './user';

const mocks = [...user];

Mock.setup({
  timeout: 2000,
});

export function mockRequest() {
  let i: MockParams;
  for (i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', i.response);
  }
}
