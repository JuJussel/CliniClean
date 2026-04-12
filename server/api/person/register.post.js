import Person from '../../models/person.model'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const person = new Person(body)
    await person.save()
    return person
})