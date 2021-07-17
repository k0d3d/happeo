const apiClient = require('./common')
const expect = require('chai').expect

jest.setTimeout(15000)

describe('batch file request within 500 sec', () => {
  test(`// Should send request only once`, async () => {
    const case1Req = apiClient.get('/file-batch-api', {params: {
      ids: ["fileid1", "fileid2"]
    }})

    const case2Req = apiClient.get('/file-batch-api', {params: {
      ids: ["fileid2"]
    }})

    const case3Req = apiClient.get('/file-batch-api', {params: {
      ids: ["fileid3"]
    }})


    const [case1, case2, case3] = await Promise.all([case1Req, case2Req, case3Req])

    expect(case1).to.eql({items: [{id:"fileid1"},{id:"fileid2"}]})
    expect(case2).to.eql({items: [{id:"fileid2"}]})
    expect(case3).to.not.eql({items: [{id:"fileid3"}]})
    expect(case3).to.eql({items: []})

  })

})
