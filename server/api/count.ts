let counter = 0
const wait = async (ms) => new Promise(resolve => setTimeout(resolve, ms));
export default async () => {
  counter++
  await wait(5000)
  return JSON.stringify(counter)
}/** */