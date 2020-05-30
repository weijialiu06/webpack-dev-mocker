import axios from 'axios';

axios.get('/sug', {
  params: {
    code: 'utf-8',
    q: '华为手机',
  },
});

// axios.post('/sug', {
//   data: {
//     q: '华小米手机',
//   },
// });
