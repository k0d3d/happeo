const apiClient = require('./common')
const expect = require('chai').expect

jest.setTimeout(10000)

describe('batch file request within 500 sec', () => {
  test(`// Should return [{id:”fileid1”},{id:”fileid2”}]`, async () => {

    const {data} = await apiClient.get('/file-batch-api', {params: {
      ids: ["fileid1", "fileid2"]
    }})
    expect(data).to.eql({items: [{id:"fileid1"},{id:"fileid2"}]})

  })
  test(`// Should return [{id:”fileid2”}]`, async () => {

    const {data} = await apiClient.get('/file-batch-api', {params: {
      ids: ["fileid2"]
    }})
    expect(data).to.eql({items: [{id:"fileid2"}]})

  })
  test(`// Should return empty for [{id:”fileid3”}]`, async () => {

    const {data} = await apiClient.get('/file-batch-api', {params: {
      ids: ["fileid3"]
    }})
    expect(data).to.not.eql({items: [{id:"fileid3"}]})
    expect(data).to.eql({items: []})

  })

  test('is batched and sent at once after 1sec', async () => {
    expect(apiClient.requestSent).to.eql(3)
  })
})
