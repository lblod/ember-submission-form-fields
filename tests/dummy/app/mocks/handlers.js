import { http, HttpResponse } from 'msw';
import { remoteUrlHandlers } from './handlers/remote-data-object';
import { filesHandlers } from './handlers/files';

export const handlers = [
  http.post('/case-number-generator/generate', ({ request }) => {
    const url = new URL(request.url);
    const prefix = url.searchParams.get('prefix') || '';

    return HttpResponse.json([`${prefix}1234`]);
  }),
  ...remoteUrlHandlers,
  ...filesHandlers,
];
