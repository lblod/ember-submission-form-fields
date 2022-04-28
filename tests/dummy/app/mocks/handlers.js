import { rest } from 'msw';

export const handlers = [
  rest.post('/case-number-generator/generate', (req, res, ctx) => {
    const prefix = req.url.searchParams.get('prefix');

    return res(ctx.status(200), ctx.json([`${prefix}1234`]));
  }),
];
