import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/case-number-generator/generate', ({ request }) => {
    const url = new URL(request.url);
    const prefix = url.searchParams.get('prefix') || '';

    return HttpResponse.json([`${prefix}1234`]);
  }),
];
