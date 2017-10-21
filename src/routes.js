/**
 * Contains all application endpoints
 */

import TestController from './controllers/TestController';

export default {
  '/test': {
    get: {
      method: TestController.testMethod,
      public: true,
    },
  },
  '/hi':  {
    get: {
      method: TestController.helloWorld,
      public: true,
    },
  },
  '/': {
    get: {
      method: TestController.getFiles,
      public: true,
    },
  },
  '/upload': {
    post: {
      method: TestController.uploadFiles,
      public: true,
    },
  },
  '/result': {
    post: {
      method: TestController.getResults,
      public: true,
    },
  },
};

