import { delay, http, HttpResponse } from 'msw';

/** @type Map<string, File> */
const uploadedFiles = new Map();

// Basic mocks for the mu-semtech/file-service (https://github.com/mu-semtech/file-service) and mu-cl-resource files models
export const filesHandlers = [
  // mock file-service uploads
  http.post('/files', async ({ request }) => {
    await delay(1000);
    const data = await request.formData();
    const file = data.get('file');
    const id = globalThis.crypto.randomUUID();

    uploadedFiles.set(id, file);

    return HttpResponse.json({
      data: {
        type: 'files',
        id,
        attributes: attributesFromFile(file),
      },
    });
  }),
  // mock file-service download
  http.get('/files/:id/download', async ({ params }) => {
    await delay();

    const mockFiles = {
      1: { path: '/mock-files/dummy.html', type: '', filename: 'dummy.html' },
      2: { path: '/mock-files/dummy.pdf', type: '', filename: 'dummy.pdf' },
      3: { path: '/mock-files/dummy.docx', type: '', filename: 'dummy.docx' },
    };

    let file = mockFiles[params.id];

    if (!file) {
      // Someone created a new remote-url and then switched to read-only mode
      // We can't access the data they entered, so we just use the first mock file for now
      file = Object.values(mockFiles).at(0);
    }

    const response = await fetch(file.path);
    if (!response.ok) {
      return response;
    }

    const buffer = await response.arrayBuffer();
    return HttpResponse.arrayBuffer(buffer, {
      headers: {
        // This matches the response of the file-service
        'content-disposition': `attachment; filename="${file.filename}"`,
      },
    });
  }),
  // mu-cl-resources file model mocks
  // retrieve a specific file record by id
  http.get('/files/:id', async ({ params }) => {
    await delay();

    let file = uploadedFiles.get(params.id);

    if (!file) {
      // The file wasn't uploaded through the test app, so we just do nothing here
      return;
    }

    return HttpResponse.json(
      generateFileJsonApiResponse(params.id, attributesFromFile(file))
    );
  }),
  // Retrieve file records by uri
  http.get('/files', async ({ request }) => {
    await delay();

    const url = new URL(request.url);
    const remoteUrlUri = url.searchParams.get('filter[:uri:]');

    let data = mockFiles[remoteUrlUri];

    if (!data) {
      // Someone created a new remote-url and then switched to read-only mode
      // We can't access the data they entered, so we just use the first mock data item for now
      data = Object.values(mockFiles).at(0);
    }

    data.uri = remoteUrlUri;

    return HttpResponse.json(generateFilesJsonApiResponse(data));
  }),
];

function generateFilesJsonApiResponse(mockData) {
  const { id, ...attributes } = mockData;
  return {
    data: [
      {
        type: 'files',
        id,
        attributes,
      },
    ],
    meta: { count: 1 },
  };
}

function generateFileJsonApiResponse(id, fileAttributes) {
  return {
    data: {
      type: 'files',
      id,
      attributes: {
        ...fileAttributes,
        uri: fileUri(id),
      },
    },
  };
}

const mockFiles = {
  [fileUri('1')]: {
    id: '2',
    filename: 'dummy.pdf',
    format: 'application/pdf',
    extension: 'pdf',
    size: 13264,
    created: '2024-03-04T12:17:07Z',
  },
  [fileUri('3')]: {
    id: '3',
    filename: 'dummy.docx',
    format:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extension: 'docx',
    size: 3533,
    created: '2024-03-04T12:17:07Z',
  },
};

/** @arg {File} file */
function attributesFromFile(file) {
  return {
    filename: file.name,
    format: file.type,
    size: file.size,
    extension: getFileExtension(file.name),
  };
}

/** @arg {string} filename */
function getFileExtension(filename) {
  return filename.split('.').at(-1);
}

/** @arg {string} id */
function fileUri(id) {
  return `http://ember-submission-form-fields/mock-file-service/files/${id}`;
}
