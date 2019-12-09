import task from '../lib/task'

export const remove = task(async (store, records, id) => {
  await store.delete(id)
  const record = records.find((record) => record.id === id)
  if (record)
    records.remove(record)
})
