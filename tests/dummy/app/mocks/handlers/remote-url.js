import { delay, http, HttpResponse } from 'msw';

export const remoteUrlHandlers = [
  http.get('/remote-urls', async ({ request }) => {
    await delay();

    const url = new URL(request.url);
    const remoteUrlUri = url.searchParams.get('filter[:uri:]');

    let data = mockData[remoteUrlUri];

    if (!data) {
      // Someone created a new remote-url and then switched to read-only mode
      // We can't access the data they entered, so we just use the first mock data item for now
      data = Object.values(mockData).at(0);
    }

    data.uri = remoteUrlUri;

    return HttpResponse.json(generateJsonApiResponse(data));
  }),
];

function generateJsonApiResponse(mockData) {
  return {
    data: [
      {
        id: mockData.id,
        type: 'remote-urls',
        attributes: {
          address: mockData.address,
          created: '2024-02-29T14:47:59.126Z',
          modified: '2024-02-29T14:47:59.126Z',
          'download-status':
            'http://lblod.data.gift/file-download-statuses/success',
          creator:
            'http://lblod.data.gift/services/validate-submission-service',
          uri: mockData.uri,
        },
      },
    ],
    meta: { count: 1 },
  };
}

const mockData = {
  'http://data.lblod.info/remote-url/1': {
    id: '1',
    address:
      'https://www.vlaanderen.be/lokaal-bestuur/loket-voor-lokale-besturen',
  },
  'http://data.lblod.info/remote-url/2': {
    id: '2',
    address:
      'https://www.vlaanderen.be/lokaal-bestuur/loket-voor-lokale-besturen/toezicht',
  },
};
