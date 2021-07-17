## Batch Requests FE Test

### Notes to self
At some point I was using await with the axiosClient.get calls. That was so painful. I didnt realize till much later, 
the test script would always exceed the timeout because the first promise will not resolve, because its in a queue.

And yes this exercise was a brain burner and fun and challenging.