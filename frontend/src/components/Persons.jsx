const Contact = ({name, number, deletionOf}) => {
  return (
    <p>{name} {number} <button onClick={deletionOf}>delete</button></p>
  )
}

const Persons = ({persons, deletionOf}) => {
  return (
    <div>
        {persons.map(person => 
          <Contact
          key={person._id}
          name ={person.name}
          number={person.number}
          deletionOf={() => deletionOf(person._id)}/>
        )}
      </div>
  )
}

export default Persons